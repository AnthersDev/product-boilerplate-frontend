export default {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure JSX component identifiers use PascalCase",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      mustBePascalCase:
        "Component '{{name}}' must be PascalCase (e.g., MyComponent).",
    },
  },
  create(context) {
    const filename = context.getFilename();
    const isTestOrStory = /\.(cy|stories)\.[tj]sx?$/.test(filename);

    if (isTestOrStory) {
      return {};
    }

    function isPascalCase(name) {
      return /^[A-Z][A-Za-z0-9]*$/.test(name);
    }

    return {
      JSXOpeningElement(node) {
        const nameNode = node.name;
        if (!nameNode) return;

        if (nameNode.type === "JSXIdentifier") {
          const name = nameNode.name;
          // Ignore intrinsic elements like 'div', 'span' (lowercase)
          if (/^[a-z]/.test(name)) return;
          if (!isPascalCase(name)) {
            context.report({
              node: nameNode,
              messageId: "mustBePascalCase",
              data: { name },
            });
          }
        } else if (nameNode.type === "JSXMemberExpression") {
          // For Member expressions, ensure the base identifier is PascalCase
          let base = nameNode;
          while (base.object && base.object.type === "JSXMemberExpression") {
            base = base.object;
          }
          if (base.object && base.object.type === "JSXIdentifier") {
            const baseName = base.object.name;
            if (!/^[a-z]/.test(baseName) && !isPascalCase(baseName)) {
              context.report({
                node: base.object,
                messageId: "mustBePascalCase",
                data: { name: baseName },
              });
            }
          }
        }
      },
    };
  },
};
