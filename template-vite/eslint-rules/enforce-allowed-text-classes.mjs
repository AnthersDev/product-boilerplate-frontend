export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Allow only approved Tailwind text-* classes: text-label, text-small, text-body, text-headline, text-mono",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      disallowed:
        "Disallowed Tailwind font-size class '{{cls}}'. Allowed classes: text-label, text-small, text-body, text-headline, text-mono.",
    },
  },
  create(context) {
    const allowed = new Set([
      "text-label",
      "text-small",
      "text-body",
      "text-headline",
      "text-mono",
    ]);

    // Only consider Tailwind font-size utilities (ignore text color, align, decoration, etc.)
    const isTailwindFontSize = (cls) =>
      /^(text-(xs|sm|base|lg|xl|[2-9]xl))$/.test(cls);

    function reportIfDisallowed(className, node) {
      if (!className) return;
      if (!className.startsWith("text-")) return;
      // Only validate true font-size tokens; ignore others like text-gray-600, text-center, etc.
      if (!isTailwindFontSize(className)) return;
      if (!allowed.has(className)) {
        context.report({
          node,
          messageId: "disallowed",
          data: { cls: className },
        });
      }
    }

    function checkLiteralClassList(value, node) {
      const classes = String(value).split(/\s+/).filter(Boolean);
      for (const cls of classes) {
        reportIfDisallowed(cls, node);
      }
    }

    function checkTemplateLiteral(tplNode) {
      // Conservative: flag any text-* present in raw strings of template
      // Expressions inside templates are ignored since we can't reliably know runtime values
      for (const quasi of tplNode.quasis) {
        const raw =
          (quasi.value && (quasi.value.raw || quasi.value.cooked)) || "";
        raw
          .split(/\s+/)
          .filter(Boolean)
          .forEach((cls) => reportIfDisallowed(cls, tplNode));
      }
    }

    function handleAttribute(attr) {
      if (!attr || attr.type !== "JSXAttribute") return;
      if (!attr.name || attr.name.name !== "className") return;
      const value = attr.value;
      if (!value) return;

      if (value.type === "Literal" && typeof value.value === "string") {
        checkLiteralClassList(value.value, value);
      } else if (value.type === "JSXExpressionContainer") {
        const expr = value.expression;
        if (!expr) return;
        switch (expr.type) {
          case "Literal":
            if (typeof expr.value === "string") {
              checkLiteralClassList(expr.value, expr);
            }
            break;
          case "TemplateLiteral":
            checkTemplateLiteral(expr);
            break;
          case "ArrayExpression":
            for (const element of expr.elements) {
              if (!element) continue;
              if (
                element.type === "Literal" &&
                typeof element.value === "string"
              ) {
                checkLiteralClassList(element.value, element);
              } else if (element.type === "TemplateLiteral") {
                checkTemplateLiteral(element);
              }
            }
            break;
          case "CallExpression":
            // Support simple cn()/clsx() patterns with string and template args
            for (const arg of expr.arguments) {
              if (!arg) continue;
              if (arg.type === "Literal" && typeof arg.value === "string") {
                checkLiteralClassList(arg.value, arg);
              } else if (arg.type === "TemplateLiteral") {
                checkTemplateLiteral(arg);
              } else if (arg.type === "ArrayExpression") {
                for (const el of arg.elements) {
                  if (!el) continue;
                  if (el.type === "Literal" && typeof el.value === "string") {
                    checkLiteralClassList(el.value, el);
                  } else if (el.type === "TemplateLiteral") {
                    checkTemplateLiteral(el);
                  }
                }
              } else if (arg.type === "ObjectExpression") {
                // Handle clsx({ 'text-sm': condition }) -> report key if disallowed
                for (const prop of arg.properties) {
                  if (prop.type !== "Property") continue;
                  if (
                    prop.key.type === "Literal" &&
                    typeof prop.key.value === "string"
                  ) {
                    checkLiteralClassList(prop.key.value, prop.key);
                  } else if (prop.key.type === "Identifier") {
                    reportIfDisallowed(prop.key.name, prop.key);
                  }
                }
              }
            }
            break;
          default:
            // Not analyzable statically; ignore
            break;
        }
      }
    }

    return {
      JSXAttribute: handleAttribute,
    };
  },
};
