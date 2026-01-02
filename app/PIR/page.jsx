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

  // === TOOLBOX ===
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
    // --------------------------------------------
    // BLOK 1: SETUP UTAMA
    // --------------------------------------------
    Blockly.Blocks["setup_block"] = {
      init: function () {
        this.appendDummyInput().appendField("Program Utama");
        this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("jalankan blok di bawah ini:");
        this.setColour(210);
      },
    };

    javascriptGenerator.forBlock["setup_block"] = function (block) {
      const statements = javascriptGenerator.statementToCode(block, "DO");
      return `
int pirPin;
int pirValue;

void setup() {
  Serial.begin(9600);
${statements}
}

void loop() {
  pirValue = digitalRead(pirPin);
  Serial.println(pirValue);
${statements}
}
`;
    };

    // --------------------------------------------
    // BLOK 2: INISIALISASI PIR
    // --------------------------------------------
    Blockly.Blocks["pir_init"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Gunakan sensor PIR di pin")
          .appendField(
            new Blockly.FieldDropdown([
              ["14", "14"],
              ["27", "27"],
              ["26", "26"],
              ["25", "25"],
            ]),
            "PIN_PIR"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(45);
      },
    };

    javascriptGenerator.forBlock["pir_init"] = function (block) {
      const pin = block.getFieldValue("PIN_PIR");
      return `  pirPin = ${pin};\n  pinMode(pirPin, INPUT);\n`;
    };

    // --------------------------------------------
    // BLOK 3: PIR READ
    // --------------------------------------------
    Blockly.Blocks["pir_read"] = {
      init: function () {
        this.appendDummyInput().appendField("Baca nilai sensor PIR");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(270);
      },
    };

    javascriptGenerator.forBlock["pir_read"] = function () {
      return `  pirValue = digitalRead(pirPin);\n  Serial.println(pirValue);\n`;
    };

    // --------------------------------------------
    // BLOK 4: PIR LOGIC
    // --------------------------------------------
    Blockly.Blocks["pir_logic"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Jika PIR mendeteksi gerakan → LED ON")
          .appendField(
            new Blockly.FieldDropdown([
              ["2", "2"],
              ["4", "4"],
              ["5", "5"],
              ["18", "18"],
            ]),
            "PIN_LED"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(0);
      },
    };

    javascriptGenerator.forBlock["pir_logic"] = function (block) {
      const pin = block.getFieldValue("PIN_LED");
      return `
  pinMode(${pin}, OUTPUT);
  if (pirValue == 1) {
    digitalWrite(${pin}, HIGH);
  } else {
    digitalWrite(${pin}, LOW);
  }
`;
    };

    // --------------------------------------------
    // BLOK 5: DELAY
    // --------------------------------------------
    Blockly.Blocks["delay_block"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Tunggu selama")
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
        this.setColour(160);
      },
    };

    javascriptGenerator.forBlock["delay_block"] = function (block) {
      const delayTime = block.getFieldValue("DELAY_TIME");
      return `  delay(${delayTime});\n`;
    };

    // --------------------------------------------
    // INIT WORKSPACE
    // --------------------------------------------
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      trashcan: true,
    });

    workspaceRef.current = workspace;

    return () => workspace.dispose();
  }, []);

  // =====================================================
  // VALIDASI BLOCK
  // =====================================================
  const validateWorkspace = () => {
    const workspace = workspaceRef.current;
    const blocks = workspace.getAllBlocks();

    let hasSetup = false;
    let hasPIRInit = false;
    let hasPIRRead = false;

    // Reset highlight dulu
    blocks.forEach((b) => b.setColour(b.originalColour || b.colour_));

    blocks.forEach((block) => {
      block.originalColour = block.colour_;

      if (block.type === "setup_block") hasSetup = true;
      if (block.type === "pir_init") hasPIRInit = true;
      if (block.type === "pir_read") hasPIRRead = true;
    });

    if (!hasSetup || !hasPIRInit || !hasPIRRead) {
      setErrorMessage("❌ Susunan blok belum lengkap! Periksa blok yang wajib digunakan.");

      blocks.forEach((block) => {
        if (
          block.type === "setup_block" ||
          block.type === "pir_init" ||
          block.type === "pir_read"
        ) {
          block.setColour("#ff5555"); // merah = error
        }
      });

      return false;
    }

    setErrorMessage("");
    return true;
  };

  // =====================================================
  // GENERATE CODE
  // =====================================================
  const generateCode = () => {
    if (!workspaceRef.current) return;

    if (!validateWorkspace()) {
      setGeneratedCode("// Perbaiki blok yang salah sebelum generate kode.");
      return;
    }

    const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    setGeneratedCode(code);
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pir_sensor.ino";
    a.click();
    URL.revokeObjectURL(url);
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-purple-600">
        👁 IoTown Blockly — Sensor PIR (Gerakan)
      </h1>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={generateCode}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          ✔️ Verifikasi & Generate Code
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
