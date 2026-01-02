"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function ServoBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============================================
  // TOOLBOX SERVO
  // ============================================
  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "servo_setup" },
      { kind: "block", type: "servo_move" },
      { kind: "block", type: "delay_block" },
    ],
  };

  // ============================================
  // INITIALIZE BLOCKLY
  // ============================================
  useEffect(() => {
    // -----------------------------
    // BLOK 1 — SETUP SERVO
    // -----------------------------
    Blockly.Blocks["servo_setup"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Gunakan Servo di pin")
          .appendField(
            new Blockly.FieldDropdown([
              ["9", "9"],
              ["5", "5"],
              ["6", "6"],
              ["10", "10"],
            ]),
            "PIN_SERVO"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(200);
      },
    };

    javascriptGenerator.forBlock["servo_setup"] = function (block) {
      const pin = block.getFieldValue("PIN_SERVO");
      return `
Servo servo1;
servo1.attach(${pin});
`;
    };

    // -----------------------------
    // BLOK 2 — MOVE SERVO ANGLE
    // -----------------------------
    Blockly.Blocks["servo_move"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Putar servo ke")
          .appendField(
            new Blockly.FieldDropdown([
              ["0°", "0"],
              ["45°", "45"],
              ["90°", "90"],
              ["135°", "135"],
              ["180°", "180"],
            ]),
            "ANGLE"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(30);
      },
    };

    javascriptGenerator.forBlock["servo_move"] = function (block) {
      const angle = block.getFieldValue("ANGLE");
      return `servo1.write(${angle});\n`;
    };

    // -----------------------------
    // BLOK 3 — DELAY
    // -----------------------------
    Blockly.Blocks["delay_block"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Tunggu")
          .appendField(
            new Blockly.FieldDropdown([
              ["200 ms", "200"],
              ["500 ms", "500"],
              ["1000 ms", "1000"],
            ]),
            "DELAY_TIME"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
      },
    };

    javascriptGenerator.forBlock["delay_block"] = function (block) {
      const time = block.getFieldValue("DELAY_TIME");
      return `delay(${time});\n`;
    };

    // -----------------------------
    // INIT WORKSPACE
    // -----------------------------
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      trashcan: true,
    });

    workspaceRef.current = workspace;

    return () => workspace.dispose();
  }, []);

  // ============================================
  // VALIDASI BLOCK
  // ============================================
  const validateWorkspace = () => {
    const workspace = workspaceRef.current;
    const blocks = workspace.getAllBlocks();

    let hasSetup = false;

    blocks.forEach((block) => {
      if (block.type === "servo_setup") hasSetup = true;
    });

    if (!hasSetup) {
      setErrorMessage("❌ Kamu belum menambahkan blok 'Gunakan Servo di pin'!");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  // ============================================
  // GENERATE CODE
  // ============================================
  const generateCode = () => {
    if (!validateWorkspace()) {
      setGeneratedCode("// Perbaiki blok yang diperlukan.");
      return;
    }

    const code = `
#include <Servo.h>

${javascriptGenerator.workspaceToCode(workspaceRef.current)}

void setup() {
  // Setup servo sudah otomatis ditambahkan oleh blok
}

void loop() {
  // Blok pergerakan servo dijalankan berulang
}
    `.trim();

    setGeneratedCode(code);
  };

  // ============================================
  // DOWNLOAD .ino
  // ============================================
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "servo_motor.ino";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================
  // UI PAGE
  // ============================================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        🔧 IoTown Blockly — Motor Servo SG90
      </h1>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-200 border border-red-500 rounded text-red-800">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={generateCode}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          ✔ Generate Code
        </button>

        <button
          onClick={downloadCode}
          disabled={!generatedCode}
          className={`${
            generatedCode
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white px-5 py-2 rounded`}
        >
          💾 Download .ino
        </button>
      </div>

      {/* BLOCKLY WORKSPACE */}
      <div
        ref={blocklyDiv}
        style={{ height: "500px", width: "100%", backgroundColor: "#f5f5f5" }}
        className="rounded-lg shadow-md mb-4"
      ></div>

      <h2 className="text-xl font-semibold">📄 Hasil Kode:</h2>
      <textarea
        className="w-full p-3 border rounded bg-gray-100 font-mono text-sm"
        rows="14"
        value={generatedCode}
        readOnly
      />
    </div>
  );
}
