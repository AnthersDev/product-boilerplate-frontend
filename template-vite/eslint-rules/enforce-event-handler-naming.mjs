export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure functions referenced as JSX event handlers start with 'on'",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      mustStartWithOn:
        "Event handler function '{{name}}' must start with 'on'.",
    },
  },
  create(context) {
    function isOnEventAttribute(attr) {
      if (!attr.name || attr.name.type !== "JSXIdentifier") return false;
      const attrName = attr.name.name;
      return /^on[A-Z]/.test(attrName);
    }

    function checkJSXAttribute(attr) {
      if (!attr || attr.type !== "JSXAttribute") return;
      // Only enforce when the attribute itself is an event-like prop (onClick, onChange, onAdd, etc.)
      if (!isOnEventAttribute(attr)) return;
      if (!attr.value || attr.value.type !== "JSXExpressionContainer") return;
      const expr = attr.value.expression;
      if (!expr) return;

      if (expr.type === "Identifier") {
        const name = expr.name;
        if (!/^on[A-Z0-9].*/.test(name)) {
          context.report({
            node: expr,
            messageId: "mustStartWithOn",
            data: { name },
          });
        }
      } else if (expr.type === "MemberExpression") {
        // e.g., this.onClick or props.onClick; only validate the property identifier
        const prop = expr.property;
        if (prop && prop.type === "Identifier") {
          const name = prop.name;
          if (!/^on[A-Z0-9].*/.test(name)) {
            context.report({
              node: prop,
              messageId: "mustStartWithOn",
              data: { name },
            });
          }
        }
      }
      // Inline anonymous functions are ignored
    }

    return {
      JSXAttribute: checkJSXAttribute,
    };
  },
};
