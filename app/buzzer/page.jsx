"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function BuzzerBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // ========================= TOOLBOX =========================
  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "buzzer_setup" },
      { kind: "block", type: "buzzer_on" },
      { kind: "block", type: "delay_block" },
      { kind: "block", type: "buzzer_off" },
    ],
  };

  // ========================= SETUP & INIT =========================
  useEffect(() => {
    // --- BLOK SETUP ---
    Blockly.Blocks["buzzer_setup"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Gunakan Buzzer di pin")
          .appendField(
            new Blockly.FieldDropdown([
              ["4", "4"],
              ["5", "5"],
              ["12", "12"],
              ["14", "14"],
            ]),
            "PIN"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(200);
      },
    };

    javascriptGenerator.forBlock["buzzer_setup"] = (block) => {
      const pin = block.getFieldValue("PIN");
      return `int buzzerPin = ${pin};\n  pinMode(buzzerPin, OUTPUT);\n`;
    };

    // --- BLOK BUZZER ON ---
    Blockly.Blocks["buzzer_on"] = {
      init: function () {
        this.appendDummyInput().appendField("Hidupkan Buzzer");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(20);
      },
    };

    javascriptGenerator.forBlock["buzzer_on"] = () => {
      return `digitalWrite(buzzerPin, HIGH);\n`;
    };

    // --- BLOK DELAY ---
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
            "TIME"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(120);
      },
    };

    javascriptGenerator.forBlock["delay_block"] = (block) => {
      const t = block.getFieldValue("TIME");
      return `delay(${t});\n`;
    };

    // --- BLOK BUZZER OFF ---
    Blockly.Blocks["buzzer_off"] = {
      init: function () {
        this.appendDummyInput().appendField("Matikan Buzzer");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(0);
      },
    };

    javascriptGenerator.forBlock["buzzer_off"] = () => {
      return `digitalWrite(buzzerPin, LOW);\n`;
    };

    // ========================= INIT WORKSPACE =========================
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      trashcan: true,
    });

    // ========================= ACAK BLOK =========================
    setTimeout(() => {
      const blocks = workspace.getAllBlocks();
      blocks.forEach((b) => {
        b.moveBy(Math.random() * 200 - 100, Math.random() * 150 - 75);
      });
    }, 100);

    workspaceRef.current = workspace;

    return () => workspace.dispose();
  }, []);

  // ========================= VALIDATION =========================
  const validateBlocks = () => {
    const workspace = workspaceRef.current;
    const blocks = workspace.getTopBlocks(true);

    const order = ["buzzer_setup", "buzzer_on", "delay_block", "buzzer_off"];

    if (blocks.length !== order.length) {
      setMessage({
        type: "error",
        text: "❌ Susunan blok masih salah! Gunakan keempat blok dalam urutan yang benar.",
      });
      return false;
    }

    for (let i = 0; i < order.length; i++) {
      if (blocks[i].type !== order[i]) {
        setMessage({
          type: "error",
          text: "❌ Urutan blok masih salah! Coba urutkan ulang: Setup → On → Delay → Off",
        });
        return false;
      }
    }

    setMessage({
      type: "success",
      text: "🎉 Hebat! Susunan blok kamu sudah BENAR!",
    });

    return true;
  };

  // ========================= GENERATE CODE =========================
  const generateCode = () => {
    if (!validateBlocks()) {
      setGeneratedCode("// Perbaiki dulu susunan blok ya 😊");
      return;
    }

    const code = `
void setup() {
${javascriptGenerator.workspaceToCode(workspaceRef.current)}
}

void loop() {
${javascriptGenerator.workspaceToCode(workspaceRef.current)}
}
    `.trim();

    setGeneratedCode(code);
  };

  // ========================= DOWNLOAD =========================
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "buzzer.ino";
    link.click();
  };

  // ========================= PAGE UI =========================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">
        🔔 IoTown Blockly — Buzzer Sederhana
      </h1>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`p-3 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-200 text-green-800 border border-green-500"
              : "bg-red-200 text-red-800 border border-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={generateCode}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          ✔ Verifikasi & Generate
        </button>

        <button
          onClick={downloadCode}
          disabled={!generatedCode}
          className={`px-4 py-2 rounded ${
            generatedCode
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          💾 Download .ino
        </button>
      </div>

      {/* BLOCKLY WORKSPACE */}
      <div
        ref={blocklyDiv}
        style={{ height: "500px", width: "100%" }}
        className="bg-gray-100 rounded shadow mb-4"
      ></div>

      <h2 className="font-semibold text-lg mb-2">📄 Hasil Kode:</h2>
      <textarea
        rows="14"
        className="w-full p-3 bg-gray-50 border rounded font-mono text-sm"
        value={generatedCode}
        readOnly
      ></textarea>
    </div>
  );
}
