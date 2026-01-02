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
    Blockly.Blocks["setup_block"] = {
      init() {
        this.appendDummyInput().appendField("Program Utama");
        this.appendStatementInput("DO").appendField("jalankan blok:");
        this.setColour(210);
      },
    };

    javascriptGenerator.forBlock["setup_block"] = (block) => {
      const blocks = [];
      let b = block.getInputTargetBlock("DO");
      while (b) {
        blocks.push(b);
        b = b.getNextBlock();
      }

      let servoPin = "D1";
      let sensorPin = "A0";
      let threshold = "618";

      blocks.forEach((b) => {
        if (b.type === "servo_init") servoPin = b.getFieldValue("PIN_SERVO");
        if (b.type === "sensor_init") sensorPin = b.getFieldValue("PIN_SENSOR");
        if (b.type === "threshold_block") threshold = b.getFieldValue("THRESH_CUSTOM");
      });

      return `#include <Servo.h>
Servo jemuran;
#define SERVO_PIN ${servoPin}
#define SENSOR_PIN ${sensorPin}
#define THRESH ${threshold}

void setup() {
  Serial.begin(115200);
  jemuran.attach(SERVO_PIN);
}

void loop() {
  int nilai = analogRead(SENSOR_PIN);
  Serial.println(nilai);

  if (nilai < THRESH) jemuran.write(160);
  else jemuran.write(30);

  delay(500);
}`;
    };

    Blockly.Blocks["servo_init"] = {
      init() {
        this.appendDummyInput()
          .appendField("Hubungkan servo ke")
          .appendField(new Blockly.FieldDropdown([
            ["D0","D0"],["D1","D1"],["D2","D2"],["D3","D3"],
            ["D4","D4"],["D5","D5"],["D6","D6"],["D7","D7"],["D8","D8"]
          ]),"PIN_SERVO");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(120);
      },
    };

    Blockly.Blocks["sensor_init"] = {
      init() {
        this.appendDummyInput().appendField("Sensor hujan di A0");
        this.appendDummyInput().appendField(new Blockly.FieldDropdown([["A0","A0"]]),"PIN_SENSOR");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(45);
      },
    };

    Blockly.Blocks["threshold_block"] = {
      init() {
        this.appendDummyInput()
          .appendField("Ambang hujan")
          .appendField(new Blockly.FieldTextInput("618"), "THRESH_CUSTOM");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(300);
      },
    };

    Blockly.Blocks["logic_block"] = { init(){ this.appendDummyInput().appendField("Logika jemuran otomatis"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(0);} };
    Blockly.Blocks["delay_block"] = { init(){ this.appendDummyInput().appendField("Delay 500ms"); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(160);} };

    const workspace = Blockly.inject(blocklyDiv.current, { toolbox });
    workspaceRef.current = workspace;
    return () => workspace.dispose();
  }, []);

  function collectOrderedChildTypes() {
    const setup = workspaceRef.current.getTopBlocks(true).find(b=>b.type==="setup_block");
    if(!setup) return [];
    const list=[];
    let b=setup.getInputTargetBlock("DO");
    while(b){ list.push(b.type); b=b.getNextBlock(); }
    return list;
  }

  function verifyArrangement(){
    const required=["servo_init","sensor_init","threshold_block","logic_block","delay_block"];
    const found=collectOrderedChildTypes();

    if(found.join()===required.join()){
      setVerifyOk(true);
      setVerifyMessage("✅ Susunan benar! Kode siap di-download.");
    } else {
      setVerifyOk(false);
      setVerifyMessage("❌ Susunan salah!\nUrutan benar:\n"+required.join(" → "));
    }
  }

  const generateCode = () => {
    verifyArrangement();
    if(!verifyOk) return;
    const setup=workspaceRef.current.getTopBlocks(true).find(b=>b.type==="setup_block");
    setGeneratedCode(javascriptGenerator.blockToCode(setup));
  };

  const downloadCode = () => {
    if(!verifyOk) return;
    const blob=new Blob([generatedCode]);
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="jemuran_esp8266.ino";
    a.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">💧 Blockly Jemuran ESP8266</h1>

      <div className="flex gap-3 mb-3">
        <button onClick={generateCode} className="bg-blue-500 text-white px-4 py-2 rounded">⚙️ Generate</button>
        <button onClick={verifyArrangement} className="bg-yellow-500 text-white px-4 py-2 rounded">🔍 Verifikasi</button>
        <button onClick={downloadCode} disabled={!verifyOk} className="bg-green-500 text-white px-4 py-2 rounded">💾 Download</button>
      </div>

      <div ref={blocklyDiv} style={{height:500}} className="bg-gray-100 mb-4 rounded"/>
      <textarea value={generatedCode} readOnly className="w-full h-48 border p-2"/>
      <pre className="mt-2">{verifyMessage}</pre>
    </div>
  );
}
