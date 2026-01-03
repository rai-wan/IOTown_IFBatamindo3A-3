"use client";
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import { javascriptGenerator } from "blockly/javascript";

export default function BuzzerBlockly() {
  const blocklyDiv = useRef(null);
  const wsRef = useRef(null);
  const [code, setCode] = useState("");
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState("");

  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "bz_setup" },
      { kind: "block", type: "bz_init" },
      { kind: "block", type: "bz_note" },
      { kind: "block", type: "bz_delay" },
    ],
  };

  useEffect(() => {

    // PROGRAM
    Blockly.Blocks["bz_setup"] = {
      init() {
        this.appendDummyInput().appendField("🎵 Program Lagu Buzzer");
        this.appendStatementInput("DO").appendField("isi dengan blok:");
        this.setColour(210);
      },
    };

    javascriptGenerator.forBlock["bz_setup"] = block => {
      let pin="5", body="";
      let b = block.getInputTargetBlock("DO");
      while(b){
        if(b.type==="bz_init") pin=b.getFieldValue("PIN");
        if(b.type==="bz_note") body += javascriptGenerator.forBlock["bz_note"](b);
        if(b.type==="bz_delay") body += javascriptGenerator.forBlock["bz_delay"](b);
        b=b.getNextBlock();
      }

      return `#define BUZZER ${pin}
void setup(){ pinMode(BUZZER,OUTPUT); }
void loop(){
${body}
}`;
    };

    // INIT
    Blockly.Blocks["bz_init"] = {
      init(){
        this.appendDummyInput()
          .appendField("Buzzer di pin")
          .appendField(new Blockly.FieldDropdown([
            ["D1","5"],["D2","4"],["D3","0"],["D4","2"],["D5","14"]
          ]),"PIN");
        this.setPreviousStatement(true); this.setNextStatement(true);
        this.setColour(60);
      }
    };
    javascriptGenerator.forBlock["bz_init"] = () => "";

    // NOTE
    Blockly.Blocks["bz_note"] = {
      init(){
        this.appendDummyInput()
          .appendField("Mainkan nada")
          .appendField(new Blockly.FieldDropdown([
            ["DO","262"],["RE","294"],["MI","330"],["FA","349"],
            ["SOL","392"],["LA","440"],["SI","494"],["DO tinggi","523"]
          ]),"NOTE");
        this.setPreviousStatement(true); this.setNextStatement(true);
        this.setColour(300);
      }
    };
    javascriptGenerator.forBlock["bz_note"] = b =>
      `tone(BUZZER, ${b.getFieldValue("NOTE")});\n`;

    // DELAY
    Blockly.Blocks["bz_delay"] = {
      init(){
        this.appendDummyInput()
          .appendField("Tunggu")
          .appendField(new Blockly.FieldDropdown([
            ["200 ms","200"],["300 ms","300"],["500 ms","500"],["800 ms","800"]
          ]),"D");
        this.setPreviousStatement(true); this.setNextStatement(true);
        this.setColour(160);
      }
    };
    javascriptGenerator.forBlock["bz_delay"] = b =>
      `delay(${b.getFieldValue("D")}); noTone(BUZZER);\n`;

    wsRef.current = Blockly.inject(blocklyDiv.current,{toolbox});
  }, []);

  function verify(){
    const hasInit = wsRef.current.getAllBlocks().some(b=>b.type==="bz_init");
    if(hasInit){
      setOk(true); setMsg("✅ Siap! Kamu bebas bikin lagu apa saja 🎶");
    } else {
      setOk(false); setMsg("❌ Tambahkan blok 'Buzzer di pin' dulu.");
    }
  }

  function generate(){
    verify();
    if(!ok) return;
    const setup = wsRef.current.getTopBlocks(true).find(b=>b.type==="bz_setup");
    setCode(javascriptGenerator.blockToCode(setup));
  }

  const download = ()=>{
    if(!ok) return;
    const blob=new Blob([code]);
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="lagu_buzzer.ino";
    a.click();
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-3 bg-white shadow flex gap-3 items-center">
        <button onClick={generate} className="bg-blue-500 text-white px-4 py-2 rounded">⚙ Generate</button>
        <button onClick={verify} className="bg-yellow-500 text-white px-4 py-2 rounded">🔍 Verifikasi</button>
        <button onClick={download} className="bg-green-500 text-white px-4 py-2 rounded">💾 Download</button>
        <span className="text-sm ml-4">{msg}</span>
      </div>

      <div className="flex flex-1">
        <div ref={blocklyDiv} className="w-1/2 bg-gray-100"/>
        <div className="w-1/2 border-l p-2">
          <div className="font-bold mb-1">Kode Arduino</div>
          <textarea className="w-full h-full border rounded p-2 font-mono text-sm" value={code} readOnly/>
        </div>
      </div>
    </div>
  );
}
