"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function TrafficLightBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");

  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "tl_setup" },
      { kind: "block", type: "tl_init" },
      { kind: "block", type: "tl_logic" },
      { kind: "block", type: "tl_delay" },
    ],
  };

  useEffect(() => {

    // ===== SETUP =====
    Blockly.Blocks["tl_setup"] = {
      init: function () {
        this.appendDummyInput().appendField("Program Traffic Light ESP8266");
        this.appendStatementInput("DO").appendField("jalankan blok:");
        this.setColour(200);
      },
    };

    javascriptGenerator.forBlock["tl_setup"] = block => {
      const s = javascriptGenerator.statementToCode(block, "DO");
      return `
int pinGreen;
int pinYellow;
int pinRed;

void setup(){
  Serial.begin(115200);
${s}
}

void loop(){
${s}
}
`;
    };

    // ===== INIT =====
    Blockly.Blocks["tl_init"] = {
      init: function () {
        this.appendDummyInput().appendField("Gunakan Lampu Traffic Light:");
        this.appendDummyInput().appendField("Pin GREEN")
          .appendField(new Blockly.FieldDropdown([
            ["D1","D1"],["D2","D2"],["D3","D3"],["D4","D4"],["D5","D5"],["D6","D6"],["D7","D7"],["D8","D8"]
          ]),"PIN_GREEN");
        this.appendDummyInput().appendField("Pin YELLOW")
          .appendField(new Blockly.FieldDropdown([
            ["D1","D1"],["D2","D2"],["D3","D3"],["D4","D4"],["D5","D5"],["D6","D6"],["D7","D7"],["D8","D8"]
          ]),"PIN_YELLOW");
        this.appendDummyInput().appendField("Pin RED")
          .appendField(new Blockly.FieldDropdown([
            ["D1","D1"],["D2","D2"],["D3","D3"],["D4","D4"],["D5","D5"],["D6","D6"],["D7","D7"],["D8","D8"]
          ]),"PIN_RED");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
      }
    };

    javascriptGenerator.forBlock["tl_init"] = b => `
pinGreen = ${b.getFieldValue("PIN_GREEN")};
pinYellow = ${b.getFieldValue("PIN_YELLOW")};
pinRed = ${b.getFieldValue("PIN_RED")};

pinMode(pinGreen, OUTPUT);
pinMode(pinYellow, OUTPUT);
pinMode(pinRed, OUTPUT);
`;

    // ===== LOGIC =====
    Blockly.Blocks["tl_logic"] = {
      init: function(){
        this.appendDummyInput().appendField("Nyalakan lampu")
          .appendField(new Blockly.FieldDropdown([
            ["Green","GREEN"],["Yellow","YELLOW"],["Red","RED"],["Semua Mati","OFF"]
          ]),"COLOR");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(20);
      }
    };

    javascriptGenerator.forBlock["tl_logic"] = b => {
      const c = b.getFieldValue("COLOR");
      if(c==="GREEN") return `digitalWrite(pinGreen,HIGH); digitalWrite(pinYellow,LOW); digitalWrite(pinRed,LOW);\n`;
      if(c==="YELLOW")return `digitalWrite(pinGreen,LOW); digitalWrite(pinYellow,HIGH); digitalWrite(pinRed,LOW);\n`;
      if(c==="RED")   return `digitalWrite(pinGreen,LOW); digitalWrite(pinYellow,LOW); digitalWrite(pinRed,HIGH);\n`;
      return `digitalWrite(pinGreen,LOW); digitalWrite(pinYellow,LOW); digitalWrite(pinRed,LOW);\n`;
    };

    // ===== DELAY =====
    Blockly.Blocks["tl_delay"] = {
      init: function(){
        this.appendDummyInput().appendField("Tunggu")
          .appendField(new Blockly.FieldDropdown([
            ["500 ms","500"],["1000 ms","1000"],["3000 ms","3000"],["5000 ms","5000"]
          ]),"DELAY");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
      }
    };

    javascriptGenerator.forBlock["tl_delay"] = b => `delay(${b.getFieldValue("DELAY")});\n`;

    const ws = Blockly.inject(blocklyDiv.current, { toolbox });
    workspaceRef.current = ws;
    return () => ws.dispose();
  }, []);

  const generateCode = () => setGeneratedCode(javascriptGenerator.workspaceToCode(workspaceRef.current));
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "traffic_light_esp8266.ino";
    a.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-600">🚦 IoTown Blockly — ESP8266</h1>
      <div className="flex gap-3 mb-4">
        <button onClick={generateCode} className="bg-blue-500 px-4 py-2 text-white rounded">Generate Code</button>
        <button onClick={downloadCode} className="bg-green-500 px-4 py-2 text-white rounded">Download .ino</button>
      </div>
      <div ref={blocklyDiv} style={{ height: 500 }} />
      <textarea className="w-full mt-3 p-2 font-mono" rows={12} value={generatedCode} readOnly />
    </div>
  );
}
