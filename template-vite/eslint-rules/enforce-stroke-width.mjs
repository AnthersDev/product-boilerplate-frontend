export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce a specific stroke-width for lucide-react icons",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [],
  },
  create: function (context) {
    // Track lucide-react imports
    const lucideImports = new Set();
    
    return {
      // Track imports from lucide-react
      ImportDeclaration(node) {
        if (node.source.value === "lucide-react") {
          node.specifiers.forEach(specifier => {
            if (specifier.type === "ImportSpecifier") {
              lucideImports.add(specifier.imported.name);
            }
          });
        }
      },
      
      JSXOpeningElement(node) {
        // Check if the component is a lucide-react component
        if (
          node.name.type === "JSXIdentifier" &&
          lucideImports.has(node.name.name)
        ) {
          const strokeWidthProp = node.attributes.find(
            (attr) => attr.type === "JSXAttribute" && attr.name && attr.name.name === "strokeWidth"
          );

          if (!strokeWidthProp) {
            context.report({
              node,
              message: `The 'strokeWidth' prop is missing on the {{iconName}} component. It must be set to 1.75.`,
              data: {
                iconName: node.name.name,
              },
              fix(fixer) {
                return fixer.insertTextAfter(node.name, " strokeWidth={1.75}");
              },
            });
          } else if (
            strokeWidthProp.value.type === "JSXExpressionContainer" &&
            strokeWidthProp.value.expression.type === "Literal" &&
            strokeWidthProp.value.expression.value !== 1.75
          ) {
            context.report({
              node: strokeWidthProp,
              message: `The 'strokeWidth' prop on the {{iconName}} component must be 1.75.`,
              data: {
                iconName: node.name.name,
              },
              fix(fixer) {
                return fixer.replaceText(strokeWidthProp.value, "{1.75}");
              },
            });
          } else if (
            strokeWidthProp.value.type === "Literal" &&
            strokeWidthProp.value.value !== "1.75"
          ) {
            context.report({
              node: strokeWidthProp,
              message: `The 'strokeWidth' prop on the {{iconName}} component must be 1.75.`,
              data: {
                iconName: node.name.name,
              },
              fix(fixer) {
                return fixer.replaceText(strokeWidthProp.value, '"1.75"');
              },
            });
          }
        }
      },
    };
  },
};
