import postcss from "postcss";
import Message from "../message/message";
import parseCssDecls from "./css/parse";
import parseFlutter from "./flutter/parse";

function adjustColorCode(inputString) {
  // Regular expression to find "Color(0x????????)" where ???? can be any hexadecimal digits
  const regex = /Color\(0x([0-9A-Fa-f]{8})\)/g;

  // Replace the found color codes
  return inputString.replace(regex, function (match, p1) {
    // Add 'FF' after '0x' and remove the last two digits
    return `Color(0xFF${p1.slice(0, 6)})`;
  });
}

const convert2Flutter = async css => {


  try {
    const ast = await postcss([
      require("postcss-transform-shortcut")({})
      // require("postcss-short-border-radius")()
    ]).process(css);

    const decls = await parseCssDecls(ast.root);
    const flutterStyle = parseFlutter(decls);

    if (flutterStyle !== "") Message.success("Has been converted successfully!");

    return adjustColorCode(flutterStyle);
    
  } catch (err) {
    const msg = dumpLogError(err);
    Message.error(msg);

    return "";
  }
};

const dumpLogError = err => {
  let msg;
  if (typeof err === "object") {
    if (err.message) {
      msg = "C2F - Message: " + err.message;
      console.log(`\n ${msg}`);
    }
    if (err.stack) {
      msg = msg || "C2F - Convert css 2 flutter error !";
      console.log("\nC2F - Stacktrace:");
      console.log("====================");
      console.log(err.stack);
    }
  } else {
    msg = "C2F - Convert css 2 flutter error !";
    console.log("C2F - dumpError :: argument is not an object");
  }

  return msg;
};

export default convert2Flutter;
