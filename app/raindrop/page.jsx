"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function RaindropBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifyOk, setVerifyOk] = useState(false);

  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "setup_block" },
      { kind: "block", type: "servo_init" },
      { kind: "block", type: "sensor_init" },
      { kind: "block", type: "threshold_block" },
      { kind: "block", type: "logic_block" },
      { kind: "block", type: "delay_block" },
    ],
  };

  useEffect(() => {
    // BLOCK: Program Utama
    Blockly.Blocks["setup_block"] = {
      init: function () {
        this.appendDummyInput().appendField("Program Utama");
        this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("jalankan blok di bawah ini:");
        this.setColour(210);
        this.setTooltip(
          "Letakkan semua blok (Servo, Sensor, Threshold, Logic, Delay) di sini."
        );
      },
    };

    javascriptGenerator.forBlock["setup_block"] = function (block) {
      function collectBlocksInStatement(statementBlock) {
        const list = [];
        let b = statementBlock;
        while (b) {
          list.push(b);
          const next =
            b.nextConnection && b.nextConnection.targetBlock
              ? b.nextConnection.targetBlock()
              : null;
          b = next;
        }
        return list;
      }

      const first = block.getInputTargetBlock("DO");
      const childBlocks = first ? collectBlocksInStatement(first) : [];

      let servoPin = "D1";
      let sensorPin = "A0";
      let threshDefaultVal = "737";
      let threshCalibVal = "618";
      let threshChoiceConst = "THRESH_CALIB";

      for (const b of childBlocks) {
        if (b.type === "servo_init") {
          const p = b.getFieldValue("PIN_SERVO");
          if (p) servoPin = p;
        }
        if (b.type === "sensor_init") {
          const p = b.getFieldValue("PIN_SENSOR");
          if (p) sensorPin = p;
        }
        if (b.type === "threshold_block") {
          const choice = b.getFieldValue("THRESH_CHOICE");
          const custom = b.getFieldValue("THRESH_CUSTOM");
          if (choice === "DEFAULT") threshChoiceConst = "THRESH_DEFAULT";
          else threshChoiceConst = "THRESH_CALIB";
          if (custom && custom.trim() !== "") {
            if (threshChoiceConst === "THRESH_CALIB")
              threshCalibVal = custom.trim();
            else threshDefaultVal = custom.trim();
          }
        }
      }

      const code = `#include <Servo.h>

Servo jemuran;
const int sensorPin = ${sensorPin};   // pastikan AO modul -> A0 pada NodeMCU
const int servoPin  = ${servoPin};   // signal servo -> D1
int nilai = 0;

// ambang: pilih salah satu
const int THRESH_DEFAULT = ${threshDefaultVal}; // konversi 2950 (ESP32 -> ESP8266)
const int THRESH_CALIB   = ${threshCalibVal}; // hasil kalibrasi dari data yang kamu kirim

// pilih ambang yang ingin dipakai:
const int THRESH = ${threshChoiceConst}; // ganti ke THRESH_DEFAULT jika ingin 2950-eq

void setup() {
  Serial.begin(115200);
  delay(100);

  jemuran.attach(servoPin); // attach sekali di setup
  delay(100);

  nilai = analogRead(sensorPin);
  Serial.print("Init A0 = ");
  Serial.println(nilai);
  Serial.print("Using THRESH = ");
  Serial.println(THRESH);

  if (nilai < THRESH) {
    jemuran.write(160); // posisi jemuran masuk
  } else {
    jemuran.write(30);  // posisi jemuran keluar
  }
  delay(500);
}

void loop() {
  long sum = 0;
  const int N = 5;
  for (int i = 0; i < N; i++) {
    sum += analogRead(sensorPin);
    delay(25);
  }
  nilai = sum / N;

  Serial.print("A0 avg = ");
  Serial.print(nilai);
  Serial.print("   (THR=");
  Serial.print(THRESH);
  Serial.println(")");

  if (nilai < THRESH) {
    jemuran.write(160);
  } else {
    jemuran.write(30);
  }

  delay(500);
}
`;
      return code;
    };

    // BLOCK: servo_init
    Blockly.Blocks["servo_init"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Hubungkan servo ke pin")
          .appendField(
            new Blockly.FieldDropdown([
              ["D0", "D0"],
              ["D1", "D1"],
              ["D2", "D2"],
              ["D3", "D3"],
              ["D4", "D4"],
              ["D5", "D5"],
              ["D6", "D6"],
              ["D7", "D7"],
              ["D8", "D8"],
            ]),
            "PIN_SERVO"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
      },
    };
    javascriptGenerator.forBlock["servo_init"] = () => "";

    // BLOCK: sensor_init
    Blockly.Blocks["sensor_init"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Gunakan sensor hujan di pin")
          .appendField(new Blockly.FieldDropdown([["A0", "A0"]]), "PIN_SENSOR");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
      },
    };
    javascriptGenerator.forBlock["sensor_init"] = () => "";

    // BLOCK: threshold
    Blockly.Blocks["threshold_block"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Pilih ambang")
          .appendField(
            new Blockly.FieldDropdown([
              ["Gunakan THRESH_CALIB (recommended)", "CALIB"],
              ["Gunakan THRESH_DEFAULT", "DEFAULT"],
            ]),
            "THRESH_CHOICE"
          );
        this.appendDummyInput()
          .appendField("Nilai custom (opsional)")
          .appendField(new Blockly.FieldTextInput("618"), "THRESH_CUSTOM");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
      },
    };
    javascriptGenerator.forBlock["threshold_block"] = () => "";

    // BLOCK: logic
    Blockly.Blocks["logic_block"] = {
      init: function () {
        this.appendDummyInput().appendField(
          "Jika nilai < ambang maka jemuran masuk, selain itu keluar"
        );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
      },
    };
    javascriptGenerator.forBlock["logic_block"] = () => "";

    // BLOCK: delay
    Blockly.Blocks["delay_block"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Tunggu selama")
          .appendField(
            new Blockly.FieldDropdown([
              ["500 ms", "500"],
              ["1000 ms", "1000"],
              ["2000 ms", "2000"],
            ]),
            "DELAY_TIME"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
    javascriptGenerator.forBlock["delay_block"] = () => "";

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      renderer: "geras",
      scrollbars: true,
      trashcan: true,
    });
    workspaceRef.current = workspace;

    return () => workspace?.dispose();
  }, []);

  function collectOrderedChildTypes() {
    if (!workspaceRef.current) return [];
    const top = workspaceRef.current.getTopBlocks(true);

    for (const t of top) {
      if (t.type === "setup_block") {
        const first = t.getInputTargetBlock("DO");
        const list = [];
        let b = first;
        while (b) {
          list.push(b.type);
          b =
            b.nextConnection && b.nextConnection.targetBlock
              ? b.nextConnection.targetBlock()
              : null;
        }
        return list;
      }
    }
    return [];
  }

  function verifyArrangement() {
    const required = [
      "servo_init",
      "sensor_init",
      "threshold_block",
      "logic_block",
      "delay_block",
    ];

    const found = collectOrderedChildTypes();

    if (found.length === 0) {
      setVerifyOk(false);
      setVerifyMessage(
        "❌ Susunan salah: Tidak menemukan blok Program Utama atau tidak ada blok di dalamnya."
      );
      return;
    }

    const mismatches = [];
    for (let i = 0; i < required.length; i++) {
      if (found[i] !== required[i]) {
        mismatches.push({
          expected: required[i],
          got: found[i] || "(kosong)",
        });
      }
    }

    if (mismatches.length === 0 && found.length === required.length) {
      setVerifyOk(true);
      setVerifyMessage("✔ Susunan blok benar! Kode siap di-download.");
    } else {
      let msg = "❌ Susunan salah!\n";
      msg += "Urutan yang benar:\n";
      msg += "1. servo_init\n2. sensor_init\n3. threshold_block\n4. logic_block\n5. delay_block\n\n";
      msg += "Urutan yang ditemukan:\n";
      found.forEach((f, i) => (msg += `${i + 1}. ${f}\n`));
      setVerifyOk(false);
      setVerifyMessage(msg);
    }
  }

  const generateCode = () => {
    if (!workspaceRef.current) return;
    const top = workspaceRef.current.getTopBlocks(true);
    let code = "";
    for (const t of top) {
      if (t.type === "setup_block") {
        code = javascriptGenerator.blockToCode(t) || "";
        break;
      }
    }
    if (!code) code = javascriptGenerator.workspaceToCode(workspaceRef.current);
    setGeneratedCode(code);
  };

  const downloadCode = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jemuran_otomatis.ino";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        💧 IoTown Blockly — Jemuran Otomatis
      </h1>

      {/* 🔥 FIXED HYDRATION ERROR: <p> diganti <div> */}
      <div className="mb-3 text-sm text-gray-700">
        <p>
          Petunjuk: Letakkan 1 blok <strong>Program Utama</strong> lalu masukkan
          blok-blok berikut (harus berurutan) di dalamnya:
        </p>

        <ol className="list-decimal list-inside ml-4 mt-2">
          <li>Hubungkan servo ke pin (pilih D0..D8)</li>
          <li>Gunakan sensor hujan di pin (A0)</li>
          <li>Pilih ambang (THRESH_CALIB / THRESH_DEFAULT)</li>
          <li>Logika jemuran (otomatis)</li>
          <li>Tunggu selama (delay)</li>
        </ol>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => {
            generateCode();
            verifyArrangement();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ⚙️ Generate & Verifikasi
        </button>

        <button
          onClick={downloadCode}
          disabled={!generatedCode || !verifyOk}
          className={`${
            generatedCode && verifyOk
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white px-4 py-2 rounded`}
        >
          💾 Download .ino
        </button>

        <button
          onClick={verifyArrangement}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          🔍 Verifikasi Susunan
        </button>
      </div>

      <div
        ref={blocklyDiv}
        style={{ height: "520px", width: "100%", backgroundColor: "#f5f5f5" }}
        className="rounded-lg shadow-md mb-4"
      ></div>

      <h2 className="text-lg font-semibold mb-2">🧠 Hasil Kode:</h2>
      <textarea
        className="w-full p-3 border rounded bg-gray-50 font-mono text-sm"
        rows="16"
        value={generatedCode}
        readOnly
      />

      <div
        className={`mt-4 p-3 rounded ${
          verifyOk ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <pre className="whitespace-pre-wrap text-sm" style={{ margin: 0 }}>
          {verifyMessage ||
            "Tekan Generate & Verifikasi untuk memeriksa susunan blok."}
        </pre>
      </div>
    </div>
  );
}
