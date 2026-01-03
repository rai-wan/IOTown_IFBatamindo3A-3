"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function PIRBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "setup_block" },
      { kind: "block", type: "pir_init" },
      { kind: "block", type: "pir_read" },
      { kind: "block", type: "pir_logic" },
      { kind: "block", type: "delay_block" },
    ],
  };

  useEffect(() => {
    Blockly.Blocks["setup_block"] = {
      init() {
        this.appendDummyInput().appendField("Program Utama");
        this.appendStatementInput("DO").appendField("jalankan:");
        this.setColour(210);
      },
    };

    javascriptGenerator.forBlock["setup_block"] = block =>
      `
int pirPin;
int pirValue;

void setup(){
${javascriptGenerator.statementToCode(block, "DO")}
}

void loop(){
${javascriptGenerator.statementToCode(block, "DO")}
}
`;

    Blockly.Blocks["pir_init"] = {
      init() {
        this.appendDummyInput()
          .appendField("Gunakan PIR di pin")
          .appendField(new Blockly.FieldDropdown([["14","14"],["27","27"],["26","26"],["25","25"]]), "PIN");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(45);
      },
    };

    javascriptGenerator.forBlock["pir_init"] = b =>
      `pinMode(${b.getFieldValue("PIN")},INPUT);\n`;

    Blockly.Blocks["pir_read"] = {
      init() {
        this.appendDummyInput().appendField("Baca PIR");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(260);
      },
    };

    javascriptGenerator.forBlock["pir_read"] = () => `pirValue=digitalRead(pirPin);\n`;

    Blockly.Blocks["pir_logic"] = {
      init() {
        this.appendDummyInput()
          .appendField("Jika PIR ON nyalakan LED")
          .appendField(new Blockly.FieldDropdown([["2","2"],["4","4"],["5","5"],["18","18"]]),"LED");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(0);
      },
    };

    javascriptGenerator.forBlock["pir_logic"] = b =>
      `digitalWrite(${b.getFieldValue("LED")},pirValue);\n`;

    Blockly.Blocks["delay_block"] = {
      init() {
        this.appendDummyInput()
          .appendField("Delay")
          .appendField(new Blockly.FieldDropdown([["200","200"],["500","500"],["1000","1000"]]),"D");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
      },
    };

    javascriptGenerator.forBlock["delay_block"] = b => `delay(${b.getFieldValue("D")});\n`;

    const ws = Blockly.inject(blocklyDiv.current, { toolbox, trashcan: true });
    workspaceRef.current = ws;
    return () => ws.dispose();
  }, []);

  const generate = () =>
    setGeneratedCode(javascriptGenerator.workspaceToCode(workspaceRef.current));

  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([generatedCode]));
    a.download = "pir.ino";
    a.click();
  };

  return (
    <div className="h-screen p-3 overflow-hidden">

      <h1 className="text-xl font-bold text-purple-600 mb-2">
        👁 IoTown — Parkiran Otomatis (PIR)
      </h1>

      <div className="flex gap-2 mb-2">
        <button onClick={generate} className="bg-purple-500 text-white px-4 py-2 rounded">Generate</button>
        <button onClick={download} className="bg-green-500 text-white px-4 py-2 rounded">Download</button>
        <button onClick={()=>workspaceRef.current.clear()} className="bg-red-500 text-white px-4 py-2 rounded">Reset</button>
      </div>

      <div className="flex h-[calc(100vh-120px)] gap-3">

        <div ref={blocklyDiv} className="w-1/2 h-full bg-gray-100 rounded shadow"/>

        <textarea
          value={generatedCode}
          readOnly
          className="w-1/2 h-full border rounded p-3 font-mono text-sm bg-gray-50"
        />
      </div>
    </div>
  );
}
