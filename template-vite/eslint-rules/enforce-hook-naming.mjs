export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure top-level function names in any src/**/hooks/** file start with 'use'",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      mustStartWithUse:
        "Hook function name must start with 'use' (e.g., useSomething).",
    },
  },
  create(context) {
    const filename = context.getFilename();
    const isInAnyHooksFolder = /[\\\/]src[\\\/](?:.*[\\\/])?hooks[\\\/]/.test(
      filename
    );
    const isTestOrStory = /\.(cy|stories)\.[tj]sx?$/.test(filename);

    if (!isInAnyHooksFolder || isTestOrStory) {
      return {};
    }

    function validateName(idNode) {
      if (!idNode || idNode.type !== "Identifier") return;
      const name = idNode.name;
      if (!/^use[A-Z0-9].*/.test(name)) {
        context.report({ node: idNode, messageId: "mustStartWithUse" });
      }
    }

    function isTopLevel(node) {
      return (
        node.parent?.type === "Program" ||
        (node.parent?.type === "ExportNamedDeclaration" &&
          node.parent.parent?.type === "Program")
      );
    }

    return {
      FunctionDeclaration(node) {
        if (!isTopLevel(node)) return;
        validateName(node.id);
      },
      VariableDeclaration(node) {
        if (!isTopLevel(node)) return;
        for (const decl of node.declarations) {
          if (!decl || decl.id.type !== "Identifier") continue;
          const init = decl.init;
          if (!init) continue;
          if (
            init.type === "ArrowFunctionExpression" ||
            init.type === "FunctionExpression"
          ) {
            validateName(decl.id);
          }
        }
      },
    };
  },
};
