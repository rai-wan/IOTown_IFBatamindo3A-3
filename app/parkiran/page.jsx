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
    Blockly.Blocks["setup_block"] = {
      init() {
        this.appendDummyInput().appendField("Program Parkir IoTown");
        this.appendStatementInput("DO").appendField("jalankan blok:");
        this.setColour(210);
      },
    };

    javascriptGenerator.forBlock["setup_block"] = function (block) {
      function collect(b) {
        const arr = [];
        while (b) {
          arr.push(b);
          b = b.nextConnection?.targetBlock() || null;
        }
        return arr;
      }

      const first = block.getInputTargetBlock("DO");
      const children = first ? collect(first) : [];

      let TRIG = "5",
        ECHO = "4",
        LED = "13",
        BUZ = "12";

      children.forEach((b) => {
        if (b.type === "ultra_init") {
          TRIG = b.getFieldValue("TRIG");
          ECHO = b.getFieldValue("ECHO");
        }
        if (b.type === "led_init") LED = b.getFieldValue("LED_PIN");
        if (b.type === "buzzer_init") BUZ = b.getFieldValue("BUZ_PIN");
      });

      return `#define trigPin ${TRIG}
#define echoPin ${ECHO}
#define ledPin ${LED}
#define buzzerPin ${BUZ}
long duration; float distance;

void setup(){
 Serial.begin(115200);
 pinMode(trigPin,OUTPUT);
 pinMode(echoPin,INPUT);
 pinMode(ledPin,OUTPUT);
 pinMode(buzzerPin,OUTPUT);
 digitalWrite(ledPin,LOW);
 noTone(buzzerPin);
}
void loop(){
 digitalWrite(trigPin,LOW); delayMicroseconds(2);
 digitalWrite(trigPin,HIGH); delayMicroseconds(10);
 digitalWrite(trigPin,LOW);
 duration=pulseIn(echoPin,HIGH,30000);
 if(duration>0) distance=duration*0.034/2;
 if(distance>0 && distance<=15){
   digitalWrite(ledPin,HIGH); tone(buzzerPin,2000);
 }else{
   digitalWrite(ledPin,LOW); noTone(buzzerPin);
 }
 delay(120);
}
`;
    };

    const empty = () => "";
    Blockly.Blocks["ultra_init"] = {
      init() {
        this.appendDummyInput()
          .appendField("HC-SR04 TRIG")
          .appendField(
            new Blockly.FieldDropdown([
              ["D1", "5"],
              ["D2", "4"],
            ]),
            "TRIG"
          )
          .appendField("ECHO")
          .appendField(
            new Blockly.FieldDropdown([
              ["D2", "4"],
              ["D1", "5"],
            ]),
            "ECHO"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(40);
      },
    };
    javascriptGenerator.forBlock["ultra_init"] = empty;

    Blockly.Blocks["led_init"] = {
      init() {
        this.appendDummyInput()
          .appendField("LED pin")
          .appendField(
            new Blockly.FieldDropdown([
              ["D7", "13"],
              ["D6", "12"],
            ]),
            "LED_PIN"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(60);
      },
    };
    javascriptGenerator.forBlock["led_init"] = empty;

    Blockly.Blocks["buzzer_init"] = {
      init() {
        this.appendDummyInput()
          .appendField("Buzzer pin")
          .appendField(
            new Blockly.FieldDropdown([
              ["D6", "12"],
              ["D7", "13"],
            ]),
            "BUZ_PIN"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(0);
      },
    };
    javascriptGenerator.forBlock["buzzer_init"] = empty;

    Blockly.Blocks["logic_block"] = {
      init() {
        this.appendDummyInput().appendField(
          "Jika jarak ≤ 15cm → LED + Buzzer ON"
        );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(300);
      },
    };
    javascriptGenerator.forBlock["logic_block"] = empty;

    Blockly.Blocks["distance_block"] = {
      init() {
        this.appendDummyInput().appendField("Baca jarak ultrasonic");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(180);
      },
    };
    javascriptGenerator.forBlock["distance_block"] = empty;

    Blockly.Blocks["delay_block"] = {
      init() {
        this.appendDummyInput()
          .appendField("Delay")
          .appendField(
            new Blockly.FieldDropdown([
              ["120 ms", "120"],
              ["500 ms", "500"],
            ]),
            "DELAY"
          );
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(160);
      },
    };
    javascriptGenerator.forBlock["delay_block"] = empty;

    const ws = Blockly.inject(blocklyDiv.current, {
      toolbox,
      trashcan: true,
      scrollbars: true,
    });
    workspaceRef.current = ws;
    return () => ws.dispose();
  }, []);

  const collectChildTypes = () => {
    const ws = workspaceRef.current;
    if (!ws) return [];
    const top = ws.getTopBlocks(true);
    for (const t of top) {
      if (t.type === "setup_block") {
        const list = [];
        let b = t.getInputTargetBlock("DO");
        while (b) {
          list.push(b.type);
          b = b.nextConnection?.targetBlock() || null;
        }
        return list;
      }
    }
    return [];
  };

  const verify = () => {
    const required = [
      "ultra_init",
      "led_init",
      "buzzer_init",
      "logic_block",
      "distance_block",
      "delay_block",
    ];
    const found = collectChildTypes();

    if (found.join() === required.join()) {
      setVerifyOk(true);
      setVerifyMessage("✔ Susunan BENAR. Kode siap di-download.");
    } else {
      setVerifyOk(false);
      setVerifyMessage("❌ Susunan SALAH! Urutan harus:\n" + required.join(" → "));
    }
  };

  const generate = () => {
    verify();
    const ws = workspaceRef.current;
    if (!ws) return;
    ws.getTopBlocks(true).forEach((b) => {
      if (b.type === "setup_block") {
        setGeneratedCode(javascriptGenerator.blockToCode(b));
      }
    });
  };

  const download = () => {
    if (!verifyOk) return;
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "smart_parkir.ino";
    a.click();
  };

    return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-3 bg-white shadow">
        <h1 className="font-bold text-blue-600 text-lg">
          🚗 IoTown Blockly — Smart Parkir
        </h1>

        {/* TOMBOL */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={verify}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            Verifikasi
          </button>

          <button
            onClick={generate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Generate
          </button>

          <button
            onClick={download}
            disabled={!verifyOk}
            className={`px-3 py-1 rounded text-sm text-white ${
              verifyOk ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
            }`}
          >
            Download
          </button>
        </div>

        {/* PESAN VERIFIKASI */}
        <div className="text-sm mt-2 whitespace-pre text-gray-700">
          {verifyMessage}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 grid grid-cols-2 gap-2 p-2">
        <div ref={blocklyDiv} className="bg-gray-100 rounded shadow h-full"></div>
        <textarea
          className="h-full p-3 border rounded bg-gray-50 font-mono text-xs"
          value={generatedCode}
          readOnly
        />
      </div>
    </div>
  );

}
