"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function ParkingBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifyOk, setVerifyOk] = useState(false);

  // TOOLBOX
  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "setup_block" },
      { kind: "block", type: "ultra_init" },
      { kind: "block", type: "led_init" },
      { kind: "block", type: "buzzer_init" },
      { kind: "block", type: "logic_block" },
      { kind: "block", type: "distance_block" },
      { kind: "block", type: "delay_block" },
    ],
  };

  useEffect(() => {
    // --------------------------------------------------------------------
    // BLOCK 1 : SETUP
    // --------------------------------------------------------------------
    Blockly.Blocks["setup_block"] = {
      init: function () {
        this.appendDummyInput().appendField("Program Utama (Parkiran)");
        this.appendStatementInput("DO")
          .setCheck(null)
          .appendField("jalankan blok-blok berikut:");
        this.setColour(210);
      },
    };

    javascriptGenerator.forBlock["setup_block"] = function (block) {
      function collectBlocks(statementBlock) {
        const list = [];
        let b = statementBlock;
        while (b) {
          list.push(b);
          b =
            b.nextConnection && b.nextConnection.targetBlock
              ? b.nextConnection.targetBlock()
              : null;
        }
        return list;
      }

      const first = block.getInputTargetBlock("DO");
      const children = first ? collectBlocks(first) : [];

      let TRIG = "5"; // D1
      let ECHO = "4"; // D2
      let LED = "13"; // D7
      let BUZZ = "12"; // D6

      for (const b of children) {
        if (b.type === "ultra_init") {
          TRIG = b.getFieldValue("TRIG");
          ECHO = b.getFieldValue("ECHO");
        }
        if (b.type === "led_init") LED = b.getFieldValue("LED_PIN");
        if (b.type === "buzzer_init") BUZZ = b.getFieldValue("BUZ_PIN");
      }

      const code = `// ----- PIN DEFINISI (AMAN UNTUK ESP8266) -----
#define trigPin ${TRIG}
#define echoPin ${ECHO}
#define ledPin ${LED}
#define buzzerPin ${BUZZ}

// ----- VARIABEL -----
long duration;
float distance;

void setup() {
  Serial.begin(115200);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  digitalWrite(ledPin, LOW);
  noTone(buzzerPin);

  Serial.println("SMART PARKIR START");
}

void loop() {
  // ----- TRIGGER HC-SR04 -----
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // ----- BACA ECHO -----
  duration = pulseIn(echoPin, HIGH, 30000); // timeout 30ms

  if (duration == 0) {
    Serial.println("No echo");
    distance = -1;
  } else {
    distance = duration * 0.034 / 2.0; // konversi jadi cm
    Serial.print("Jarak: ");
    Serial.print(distance);
    Serial.println(" cm");
  }

  // ----- LOGIKA PARKIR -----
  if (distance > 0 && distance <= 15) {
    digitalWrite(ledPin, HIGH);
    tone(buzzerPin, 2000);
  } else {
    digitalWrite(ledPin, LOW);
    noTone(buzzerPin);
  }

  delay(120);
}
`;
      return code;
    };

    // --------------------------------------------------------------------
    // BLOCK 2 : ULTRASONIC INIT
    // --------------------------------------------------------------------
    Blockly.Blocks["ultra_init"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("HC-SR04 trig")
          .appendField(
            new Blockly.FieldDropdown([
              ["5 (D1)", "5"],
              ["4 (D2)", "4"],
              ["14 (D5)", "14"],
            ]),
            "TRIG"
          )
          .appendField("echo")
          .appendField(
            new Blockly.FieldDropdown([
              ["4 (D2)", "4"],
              ["5 (D1)", "5"],
              ["12 (D6)", "12"],
            ]),
            "ECHO"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
      },
    };
    javascriptGenerator.forBlock["ultra_init"] = () => "";

    // --------------------------------------------------------------------
    // BLOCK 3 : LED INIT
    // --------------------------------------------------------------------
    Blockly.Blocks["led_init"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("LED pada pin")
          .appendField(
            new Blockly.FieldDropdown([
              ["13 (D7)", "13"],
              ["12 (D6)", "12"],
              ["14 (D5)", "14"],
            ]),
            "LED_PIN"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
      },
    };
    javascriptGenerator.forBlock["led_init"] = () => "";

    // --------------------------------------------------------------------
    // BLOCK 4 : BUZZER INIT
    // --------------------------------------------------------------------
    Blockly.Blocks["buzzer_init"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Buzzer pada pin")
          .appendField(
            new Blockly.FieldDropdown([
              ["12 (D6)", "12"],
              ["13 (D7)", "13"],
            ]),
            "BUZ_PIN"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
      },
    };
    javascriptGenerator.forBlock["buzzer_init"] = () => "";

    // --------------------------------------------------------------------
    // BLOCK 5 : LOGIC
    // --------------------------------------------------------------------
    Blockly.Blocks["logic_block"] = {
      init: function () {
        this.appendDummyInput().appendField(
          "Jika jarak ≤ 15cm → LED ON + Buzzer ON"
        );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
      },
    };
    javascriptGenerator.forBlock["logic_block"] = () => "";

    // --------------------------------------------------------------------
    // BLOCK 6 : DISTANCE READ
    // --------------------------------------------------------------------
    Blockly.Blocks["distance_block"] = {
      init: function () {
        this.appendDummyInput().appendField("Baca jarak ultrasonic");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
      },
    };
    javascriptGenerator.forBlock["distance_block"] = () => "";

    // --------------------------------------------------------------------
    // BLOCK 7 : DELAY
    // --------------------------------------------------------------------
    Blockly.Blocks["delay_block"] = {
      init: function () {
        this.appendDummyInput()
          .appendField("Tunggu")
          .appendField(
            new Blockly.FieldDropdown([
              ["120 ms", "120"],
              ["500 ms", "500"],
              ["1000 ms", "1000"],
            ]),
            "DELAY_TIME"
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
    javascriptGenerator.forBlock["delay_block"] = () => "";

    // --------------------------------------------------------------------
    // INJECT WORKSPACE
    // --------------------------------------------------------------------
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      renderer: "geras",
      scrollbars: true,
      trashcan: true,
    });
    workspaceRef.current = workspace;

    return () => workspace?.dispose();
  }, []);

  // --------------------------------------------------------------------
  // VERIFICATION
  // --------------------------------------------------------------------
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
      "ultra_init",
      "led_init",
      "buzzer_init",
      "logic_block",
      "distance_block",
      "delay_block",
    ];

    const found = collectOrderedChildTypes();

    if (found.length === 0) {
      setVerifyOk(false);
      setVerifyMessage(
        "❌ Tidak ada blok Program Utama atau blok di dalamnya kosong."
      );
      return;
    }

    let mismatch = [];
    for (let i = 0; i < required.length; i++) {
      if (found[i] !== required[i]) {
        mismatch.push({
          expected: required[i],
          got: found[i] || "(kosong)",
        });
      }
    }

    if (mismatch.length === 0 && found.length === required.length) {
      setVerifyOk(true);
      setVerifyMessage("✔ Susunan benar! Kode siap di-download.");
    } else {
      let msg = "❌ Susunan salah!\n\nUrutan benar:\n";
      required.forEach((b, i) => (msg += `${i + 1}. ${b}\n`));

      msg += "\nUrutan kamu:\n";
      found.forEach((f, i) => (msg += `${i + 1}. ${f}\n`));

      setVerifyOk(false);
      setVerifyMessage(msg);
    }
  }

  // --------------------------------------------------------------------
  // GENERATE CODE
  // --------------------------------------------------------------------
  const generateCode = () => {
    if (!workspaceRef.current) return;
    const top = workspaceRef.current.getTopBlocks(true);

    let code = "";
    for (const t of top) {
      if (t.type === "setup_block") {
        code = javascriptGenerator.blockToCode(t) || "";
      }
    }
    setGeneratedCode(code);
  };

  // --------------------------------------------------------------------
  // DOWNLOAD .INO
  // --------------------------------------------------------------------
  const downloadCode = () => {
    if (!generatedCode || !verifyOk) return;
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smart_parkir.ino";
    a.click();
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------------------------
  // RENDER PAGE
  // --------------------------------------------------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        🚗 IoTown Blockly — Smart Parkiran
      </h1>

      <div className="mb-3 text-sm text-gray-700">
        <p>Letakkan 1 blok <b>Program Utama</b> lalu isi dengan 6 blok:</p>

        <ol className="list-decimal ml-5 mt-2">
          <li>HC-SR04 init</li>
          <li>LED init</li>
          <li>Buzzer init</li>
          <li>Logika parkir</li>
          <li>Baca jarak</li>
          <li>Delay</li>
        </ol>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => {
            generateCode();
            verifyArrangement();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          🔍 Verifikasi Susunan
        </button>
      </div>

      <div
        ref={blocklyDiv}
        style={{ height: "520px", width: "100%", background: "#f5f5f5" }}
        className="rounded-lg shadow mb-4"
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
        <pre className="whitespace-pre-wrap text-sm m-0">{verifyMessage}</pre>
      </div>
    </div>
  );
}
