"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function TrafficLightBlockly() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifyOk, setVerifyOk] = useState(false);

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

    // ================= SETUP =================
    Blockly.Blocks["tl_setup"] = {
      init() {
        this.appendDummyInput().appendField("Program Traffic Light ESP8266");
        this.appendStatementInput("DO").appendField("jalankan:");
        this.setColour(200);
      },
    };

    javascriptGenerator.forBlock["tl_setup"] = block => {
      const list=[]; let b=block.getInputTargetBlock("DO");
      while(b){ list.push(b); b=b.getNextBlock(); }

      let g="D1",y="D2",r="D3",logic="";

      list.forEach(b=>{
        if(b.type==="tl_init"){
          g=b.getFieldValue("PIN_GREEN");
          y=b.getFieldValue("PIN_YELLOW");
          r=b.getFieldValue("PIN_RED");
        }
        if(b.type==="tl_logic"||b.type==="tl_delay"){
          logic+=javascriptGenerator.blockToCode(b);
        }
      });

      return `int pinGreen=${g};
int pinYellow=${y};
int pinRed=${r};

void setup(){
 pinMode(pinGreen,OUTPUT);
 pinMode(pinYellow,OUTPUT);
 pinMode(pinRed,OUTPUT);
}

void loop(){
${logic}
}
`;
    };

    // ================= INIT =================
    Blockly.Blocks["tl_init"] = {
      init() {
        this.appendDummyInput().appendField("Gunakan Lampu Traffic Light");
        this.appendDummyInput().appendField("GREEN").appendField(new Blockly.FieldDropdown([["D1","D1"],["D2","D2"],["D3","D3"],["D4","D4"],["D5","D5"],["D6","D6"],["D7","D7"],["D8","D8"]]),"PIN_GREEN");
        this.appendDummyInput().appendField("YELLOW").appendField(new Blockly.FieldDropdown([["D1","D1"],["D2","D2"],["D3","D3"],["D4","D4"],["D5","D5"],["D6","D6"],["D7","D7"],["D8","D8"]]),"PIN_YELLOW");
        this.appendDummyInput().appendField("RED").appendField(new Blockly.FieldDropdown([["D1","D1"],["D2","D2"],["D3","D3"],["D4","D4"],["D5","D5"],["D6","D6"],["D7","D7"],["D8","D8"]]),"PIN_RED");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(120);
      }
    };

    // ================= LOGIC =================
    Blockly.Blocks["tl_logic"] = {
      init() {
        this.appendDummyInput().appendField("Nyalakan")
          .appendField(new Blockly.FieldDropdown([
            ["Green","GREEN"],["Yellow","YELLOW"],["Red","RED"]
          ]),"C");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(20);
      }
    };

    javascriptGenerator.forBlock["tl_logic"] = b=>{
      const c=b.getFieldValue("C");
      if(c==="GREEN") return `digitalWrite(pinGreen,HIGH);digitalWrite(pinYellow,LOW);digitalWrite(pinRed,LOW);\n`;
      if(c==="YELLOW")return `digitalWrite(pinGreen,LOW);digitalWrite(pinYellow,HIGH);digitalWrite(pinRed,LOW);\n`;
      return `digitalWrite(pinGreen,LOW);digitalWrite(pinYellow,LOW);digitalWrite(pinRed,HIGH);\n`;
    };

    // ================= DELAY =================
    Blockly.Blocks["tl_delay"] = {
      init() {
        this.appendDummyInput().appendField("Tunggu")
          .appendField(new Blockly.FieldDropdown([
            ["1000","1000"],["3000","3000"],["5000","5000"]
          ]),"D");
        this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(160);
      }
    };

    javascriptGenerator.forBlock["tl_delay"] = b=>`delay(${b.getFieldValue("D")});\n`;

    const ws=Blockly.inject(blocklyDiv.current,{toolbox});
    workspaceRef.current=ws;
    return ()=>ws.dispose();
  }, []);

  // ================= VERIFY =================
  function verifyArrangement(){
    const setup=workspaceRef.current.getTopBlocks(true).find(b=>b.type==="tl_setup");
    if(!setup) return setVerifyMessage("❌ Tambahkan Program Traffic Light dulu!");

    const types=[]; let b=setup.getInputTargetBlock("DO");
    while(b){ types.push(b.type); b=b.getNextBlock(); }

    const correct=["tl_init","tl_logic","tl_delay","tl_logic","tl_delay","tl_logic","tl_delay"];

    if(types.join()==correct.join()){
      setVerifyOk(true);
      setVerifyMessage("✅ Susunan BENAR!");
    }else{
      setVerifyOk(false);
      setVerifyMessage("❌ SALAH!\nUrutan benar:\n"+correct.join(" → "));
    }
  }

  const generateCode=()=>{ verifyArrangement(); if(verifyOk){
    const setup=workspaceRef.current.getTopBlocks(true).find(b=>b.type==="tl_setup");
    setGeneratedCode(javascriptGenerator.blockToCode(setup));
  }};

  const downloadCode=()=>{ if(!verifyOk) return;
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([generatedCode]));
    a.download="traffic_light_esp8266.ino";
    a.click();
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 shadow flex gap-3 bg-white">
        <button onClick={generateCode} className="bg-blue-500 text-white px-4 py-2 rounded">⚙ Generate</button>
        <button onClick={verifyArrangement} className="bg-yellow-500 text-white px-4 py-2 rounded">🔍 Verifikasi</button>
        <button onClick={downloadCode} disabled={!verifyOk} className="bg-green-500 text-white px-4 py-2 rounded">💾 Download</button>
        <span className="ml-3 whitespace-pre text-sm">{verifyMessage}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div ref={blocklyDiv} className="w-1/2 bg-gray-100"/>
        <textarea value={generatedCode} readOnly className="w-1/2 border-l p-3 font-mono text-sm"/>
      </div>
    </div>
  );
}
