"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function ServoBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifyOk, setVerifyOk] = useState(false);

  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "servo_setup" },
      { kind: "block", type: "servo_wire_brown" },
      { kind: "block", type: "servo_wire_red" },
      { kind: "block", type: "servo_wire_orange" },
      { kind: "block", type: "servo_move" },
      { kind: "block", type: "delay_block" },
    ],
  };

  useEffect(() => {

    Blockly.Blocks["servo_setup"] = {
      init() {
        this.appendDummyInput().appendField("Program Servo SG90");
        this.appendStatementInput("DO").appendField("jalankan blok:");
        this.setColour(210);
      },
    };

    Blockly.Blocks["servo_wire_brown"] = {
      init() {
        this.appendDummyInput().appendField("🟤 Kabel COKLAT → GND");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(60);
      }
    };

    Blockly.Blocks["servo_wire_red"] = {
      init() {
        this.appendDummyInput().appendField("🔴 Kabel MERAH → 5V / 3V");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(0);
      }
    };

    Blockly.Blocks["servo_wire_orange"] = {
      init() {
        this.appendDummyInput()
          .appendField("🟠 Kabel ORANGE ke pin")
          .appendField(new Blockly.FieldDropdown([
            ["D0","D0"],["D1","D1"],["D2","D2"],["D3","D3"],
            ["D4","D4"],["D5","D5"],["D6","D6"],["D7","D7"],["D8","D8"]
          ]),"PIN");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(25);
      }
    };

    Blockly.Blocks["servo_move"] = {
      init() {
        this.appendDummyInput()
          .appendField("Putar servo ke")
          .appendField(new Blockly.FieldDropdown([
            ["0°","0"],["45°","45"],["90°","90"],["135°","135"],["180°","180"]
          ]),"ANGLE");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(120);
      }
    };

    Blockly.Blocks["delay_block"] = {
      init() {
        this.appendDummyInput()
          .appendField("Tunggu")
          .appendField(new Blockly.FieldDropdown([
            ["500 ms","500"],["1000 ms","1000"],["2000 ms","2000"]
          ]),"TIME");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(160);
      }
    };

    javascriptGenerator.forBlock["servo_setup"] = block => {
      let pin = "D1";
      let moves = "";

      let b = block.getInputTargetBlock("DO");
      while (b) {
        if (b.type === "servo_wire_orange") pin = b.getFieldValue("PIN");
        if (b.type === "servo_move") moves += `  servo.write(${b.getFieldValue("ANGLE")});\n`;
        if (b.type === "delay_block") moves += `  delay(${b.getFieldValue("TIME")});\n`;
        b = b.getNextBlock();
      }

      return `#include <Servo.h>
Servo servo;

void setup(){
  servo.attach(${pin});
}

void loop(){
${moves}
}
`;
    };

    const ws = Blockly.inject(blocklyDiv.current, { toolbox });
    workspaceRef.current = ws;
    return () => ws.dispose();
  }, []);

  const verify = () => {
    const top = workspaceRef.current.getTopBlocks(true);
    if (!top.find(b=>b.type==="servo_setup")){
      setVerifyOk(false);
      setVerifyMessage("❌ Tambahkan blok Program Servo SG90 dulu.");
      return;
    }
    setVerifyOk(true);
    setVerifyMessage("✅ Susunan benar. Siap generate!");
  };

  const generate = () => {
    verify();
    if (!verifyOk) return;
    const setup = workspaceRef.current.getTopBlocks(true).find(b=>b.type==="servo_setup");
    setGeneratedCode(javascriptGenerator.blockToCode(setup));
  };

  const download = () => {
    const blob = new Blob([generatedCode]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "servo_sg90_esp8266.ino";
    a.click();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      <div className="p-3 bg-white shadow">
        <h1 className="font-bold text-blue-600 text-lg">⚙️ IoTown Blockly — Servo SG90 (ESP8266)</h1>

        <div className="flex gap-2 mt-2">
          <button onClick={verify} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Verifikasi</button>
          <button onClick={generate} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Generate</button>
          <button onClick={download} disabled={!verifyOk} className={`px-3 py-1 rounded text-sm text-white ${verifyOk?"bg-green-500":"bg-gray-400"}`}>Download</button>
        </div>

        <div className="text-sm mt-1">{verifyMessage}</div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2 p-2">
        <div ref={blocklyDiv} className="bg-gray-100 rounded shadow"></div>
        <textarea className="h-full p-3 border rounded bg-gray-50 font-mono text-xs" value={generatedCode} readOnly/>
      </div>
    </div>
  );
}
