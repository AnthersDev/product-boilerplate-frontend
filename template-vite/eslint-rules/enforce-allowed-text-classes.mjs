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

    const getBaseUtility = (cls) => {
      let bracketDepth = 0;
      let lastVariantSeparator = -1;

      for (let index = 0; index < cls.length; index += 1) {
        if (cls[index] === "[") bracketDepth += 1;
        else if (cls[index] === "]" && bracketDepth > 0) bracketDepth -= 1;
        else if (cls[index] === ":" && bracketDepth === 0) lastVariantSeparator = index;
      }

      return cls.slice(lastVariantSeparator + 1).replace(/^!/, "");
    };

    // Only consider Tailwind font-size utilities (ignore text color, align, decoration, etc.)
    const isTailwindFontSize = (cls) => {
      if (/^text-(xs|sm|base|lg|xl|[2-9]xl)$/.test(cls)) return true;

      const arbitraryValue = cls.match(/^text-\[(.*)\]$/)?.[1];
      if (!arbitraryValue) return false;
      if (arbitraryValue.startsWith("length:")) return true;

      return /^(?:-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vw|vh|vmin|vmax|svw|lvw|dvw|svh|lvh|dvh|ch|ex|ic|lh|rlh|cm|mm|in|pt|pc|q)|(?:calc|min|max|clamp)\(.+\))$/.test(
        arbitraryValue
      );
    };

    function reportIfDisallowed(className, node) {
      if (!className) return;
      const baseUtility = getBaseUtility(className);
      if (!baseUtility.startsWith("text-")) return;
      // Only validate true font-size tokens; ignore others like text-gray-600, text-center, etc.
      if (!isTailwindFontSize(baseUtility)) return;
      if (!allowed.has(baseUtility)) {
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

    function checkExpression(expr) {
      if (!expr) return;

      switch (expr.type) {
        case "Literal":
          if (typeof expr.value === "string") checkLiteralClassList(expr.value, expr);
          break;
        case "TemplateLiteral":
          checkTemplateLiteral(expr);
          break;
        case "ArrayExpression":
          for (const element of expr.elements) {
            if (element && element.type !== "SpreadElement") checkExpression(element);
          }
          break;
        case "CallExpression":
          for (const arg of expr.arguments) {
            if (arg && arg.type !== "SpreadElement") checkExpression(arg);
          }
          break;
        case "ObjectExpression":
          for (const prop of expr.properties) {
            if (prop.type !== "Property") continue;
            if (prop.key.type === "Literal" && typeof prop.key.value === "string") {
              checkLiteralClassList(prop.key.value, prop.key);
            } else if (prop.key.type === "Identifier") {
              reportIfDisallowed(prop.key.name, prop.key);
            }
          }
          break;
        case "ConditionalExpression":
          checkExpression(expr.consequent);
          checkExpression(expr.alternate);
          break;
        case "LogicalExpression":
          checkExpression(expr.left);
          checkExpression(expr.right);
          break;
        default:
          // Not analyzable statically; ignore.
          break;
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
        checkExpression(value.expression);
      }
    }

    return {
      JSXAttribute: handleAttribute,
    };
  },
};
