"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function TrafficLightBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");

  // === TOOLBOX ===
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
    // === BLOK 1 — SETUP PROGRAM ===
    Blockly.Blocks["tl_setup"] = {
      init: function () {
        this.appendDummyInput().appendField("Program Traffic Light");
        this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("jalankan blok berikut:");
        this.setColour(200);
      },
    };

    javascriptGenerator.forBlock["tl_setup"] = function (block) {
      const statements = javascriptGenerator.statementToCode(block, "DO");
      return `
int pinGreen;
int pinYellow;
int pinRed;

void setup() {
  Serial.begin(9600);
${statements}
}

void loop() {
${statements}
}
`;
    };

    // === BLOK 2 — INISIALISASI PIN ===
    Blockly.Blocks["tl_init"] = {
      init: function () {
        this.appendDummyInput().appendField("Gunakan Lampu Traffic Light:");
        this.appendDummyInput()
          .appendField("Pin GREEN")
          .appendField(
            new Blockly.FieldDropdown([
              ["13", "13"],
              ["3", "3"],
              ["21", "21"],
              ["12", "12"],
              ["14", "14"],
              ["27", "27"],
            ]),
            "PIN_GREEN"
          );
        this.appendDummyInput()
          .appendField("Pin YELLOW")
          .appendField(
            new Blockly.FieldDropdown([
              ["26", "26"],
              ["1", "1"],
              ["22", "22"],
              ["25", "25"],
              ["33", "33"],
              ["32", "32"],
            ]),
            "PIN_YELLOW"
          );
        this.appendDummyInput()
          .appendField("Pin RED")
          .appendField(
            new Blockly.FieldDropdown([
              ["5", "5"],
              ["18", "18"],
              ["2", "2"],
              ["23", "23"],
              ["19", "19"],
              ["23", "23"],
            ]),
            "PIN_RED"
          );

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };

    javascriptGenerator.forBlock["tl_init"] = function (block) {
      const g = block.getFieldValue("PIN_GREEN");
      const y = block.getFieldValue("PIN_YELLOW");
      const r = block.getFieldValue("PIN_RED");

      return `
  pinGreen = ${g};
  pinYellow = ${y};
  pinRed = ${r};

  pinMode(pinGreen, OUTPUT);
  pinMode(pinYellow, OUTPUT);
  pinMode(pinRed, OUTPUT);
`;
    };

    // === BLOK 3 — LOGIKA TRAFFIC LIGHT ===
    Blockly.Blocks["tl_logic"] = {
      init: function () {
        this.appendDummyInput().appendField("Nyalakan lampu");
        this.appendDummyInput().appendField(
          new Blockly.FieldDropdown([
            ["Green", "GREEN"],
            ["Yellow", "YELLOW"],
            ["Red", "RED"],
            ["Semua Mati", "OFF"],
          ]),
          "COLOR"
        );

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
      },
    };

    javascriptGenerator.forBlock["tl_logic"] = function (block) {
      const color = block.getFieldValue("COLOR");

      if (color === "GREEN") {
        return `
  digitalWrite(pinGreen, HIGH);
  digitalWrite(pinYellow, LOW);
  digitalWrite(pinRed, LOW);
`;
      }
      if (color === "YELLOW") {
        return `
  digitalWrite(pinGreen, LOW);
  digitalWrite(pinYellow, HIGH);
  digitalWrite(pinRed, LOW);
`;
      }
      if (color === "RED") {
        return `
  digitalWrite(pinGreen, LOW);
  digitalWrite(pinYellow, LOW);
  digitalWrite(pinRed, HIGH);
`;
      }
      if (color === "OFF") {
        return `
  digitalWrite(pinGreen, LOW);
  digitalWrite(pinYellow, LOW);
  digitalWrite(pinRed, LOW);
`;
      }
    };

    // === BLOK 4 — DELAY ===
    Blockly.Blocks["tl_delay"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Tunggu selama")
          .appendField(
            new Blockly.FieldDropdown([
              ["500 ms", "500"],
              ["1000 ms", "1000"],
              ["3000 ms", "3000"],
              ["5000 ms", "5000"],
            ]),
            "DELAY"
          );

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };

    javascriptGenerator.forBlock["tl_delay"] = function (block) {
      const t = block.getFieldValue("DELAY");
      return `  delay(${t});\n`;
    };

    // === INIT WORKSPACE ===
    const workspace = Blockly.inject(blocklyDiv.current, { toolbox });
    workspaceRef.current = workspace;

    return () => workspace.dispose();
  }, []);

  // === GENERATE CODE BUTTON ===
  const generateCode = () => {
    if (!workspaceRef.current) return;
    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    setGeneratedCode(code);
  };

  // === DOWNLOAD CODE ===
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "traffic_light.ino";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-600">
        🚦 IoTown Blockly — Traffic Light (Lampu Merah)
      </h1>

      <div className="flex gap-3 mb-4">
        <button
          onClick={generateCode}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ⚙️ Generate Code
        </button>

        <button
          onClick={downloadCode}
          disabled={!generatedCode}
          className={`${
            generatedCode
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white px-4 py-2 rounded`}
        >
          💾 Download .ino
        </button>
      </div>

      <div
        ref={blocklyDiv}
        style={{ height: "500px", width: "100%", backgroundColor: "#f5f5f5" }}
        className="rounded-lg shadow-md mb-4"
      ></div>

      <h2 className="text-lg font-semibold mb-2">🧠 Hasil Kode:</h2>

      <textarea
        className="w-full p-3 border rounded bg-gray-50 font-mono text-sm"
        rows="14"
        value={generatedCode}
        readOnly
      />
    </div>
  );
}
