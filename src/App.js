import React, { useEffect, useState } from 'react'
import { firstSoundGroup } from './components/firstSoundGroup';
import { secondSoundGroup } from './components/secondSoundGroup';
import { thirdSoundGroup } from './components/thirdSoundGroup';
import { fourthSoundGroup } from './components/fourthSoundGroup';

const soundsName = {
  tr808Kit: "TR-808 Kit",
  tr909Kit: "TR-909 Kit",
  thirdKit: "Third Kit",
  fourthKit: "Fourth Kit"
};

const soundGroup = {
  tr808Kit: firstSoundGroup,
  tr909Kit: secondSoundGroup,
  thirdKit: thirdSoundGroup,
  fourthKit: fourthSoundGroup
};

const KeyboardKey = ({ play, sound: { id, key, url, keyCode } }) => {

  const handleKeyDown = (e) => {
    if (e.keyCode === keyCode) {
      play(key, id);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  }, []);

  return <button id={keyCode} className='drum-pad' onClick={() => play(key, id)}>
      <audio className='clip' id={key} src={url} />
        {key} 
    </button>
};

const Keyboard = ({ id, power, play, sounds }) => (
  <div className='keyboard-wrapper'>
    <div className='keyboard'>
      {power ? sounds.map((sound) => <KeyboardKey key={id} play={play} sound={sound} />) : sounds.map((sound) => <KeyboardKey key={id} play={play} sound={{...sound, url: "#"}} />)}
    </div>
  </div>

);

const Screen = ({ name, volume, power }) => (
  <div className='screen'>
    <h2 id='sound-display'>{power ? name : ""}</h2>
    <h2 id='volume-display' style={power ? {color: "black"} : {color: "#7e9908"}}>Volume: {Math.round(volume * 100)}%</h2>
  </div>
);
 
const Volume = ({ volume, handleVolumeChange }) => (
  <div className='volume'>
    
     <input
      max="1"
      min="0"
      step='0.01'
      type="range"
      value={volume}
      onChange={handleVolumeChange}
      />
      <h4>Master Volume</h4>
  </div>
);

const SwitchBank = ({ switchBank, switchBankBack }) => (
  <div className='switch-bank'>
    <i class="arrow right" className='switch-bank left' onClick={switchBankBack}></i>
      <h4>Switch Bank</h4>
    <button className='switch-bank right' onClick={switchBank}></button>
  </div>
);

const Power = ({ stop, power }) => (
  <div className='power'>
    <button id="powerbutton" onClick={stop}>POWER</button>
    <button id="on-off" style={power ? { backgroundColor: "#B3EA7B"} : {backgroundColor: "#B41717"}}></button>
  </div>
);

const Dummies = () => (
  <>
    <div className='dummy-buttons1'>
      <button id="dummy1"></button>
      <button id="dummy1"></button>
      <button id="dummy1"></button>  
      <button id="dummy1"></button>
      <button id="dummy1"></button>
    </div>
    <div className='dummy-buttons2'>
      <button id="dummy" style={{ backgroundColor: "red"}}></button>
      <button id="dummy" style={{ backgroundColor: "red"}}></button>
      <button id="dummy"></button>
      <button id="dummy"></button>
      <button id="dummy"></button>
    </div>
  </>  
);

function App() {
  const [power, setPower] = useState(true)
  const [volume, setVolume] = useState(0.8);
  const [soundType, setSoundType] = useState("tr808Kit");
  const [sounds, setSounds] = useState(soundGroup[soundType]);
  const [soundName, setSoundName] = useState("");

  const stop = () => {
    setPower(!power);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const styleActiveKey = (audio) => {
    audio.parentElement.style.backgroundColor = "#000000"
    audio.parentElement.style.color = "#ffffff"
  };

  const deactivateAudio = (audio) => {
    setTimeout(() => {
      audio.parentElement.style.backgroundColor = "#464646"
      audio.parentElement.style.color = "#ffffff"
    }, 300)
  };

  const play = (key, sound) => {
    setSoundName(sound);
    const audio = document.getElementById(key);
    styleActiveKey(audio);
    audio.currentTime = 0;
    audio.play();
    deactivateAudio(audio);
  };

  const switchBank = () => {
    setSoundName("");
    if (soundType === "tr808Kit") {
      setSoundType("tr909Kit");
      setSounds(soundGroup.tr909Kit);
    } else if (soundType === "tr909Kit") {
      setSoundType("thirdKit");
      setSounds(soundGroup.thirdKit);
    } else if (soundType === "thirdKit")  {
      setSoundType("fourthKit");
      setSounds(soundGroup.fourthKit)
    } else if (soundType === "fourthKit") {
      setSoundType("tr808Kit")
      setSounds(soundGroup.tr808Kit)
    }
  };

  const switchBankBack = () => {
    setSoundName("");
    if (soundType === "tr808Kit") {
      setSoundType("fourthKit");
      setSounds(soundGroup.fourthKit);
    } else if (soundType === "fourthKit") {
      setSoundType("thirdKit");
      setSounds(soundGroup.thirdKit);
    } else if (soundType === "thirdKit")  {
      setSoundType("tr909Kit");
      setSounds(soundGroup.tr909Kit)
    } else if (soundType === "tr909Kit") {
      setSoundType("tr808Kit")
      setSounds(soundGroup.tr808Kit)
    }
  };

  const setKeyVolume = () => {
    const audios = sounds.map(sound => document.getElementById(sound.key));
    audios.forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    })
  };

  return (
    <div id="drum-machine">
      {setKeyVolume()}
      <div className='wrapper'>
        <Keyboard power={power} play={play} sounds={sounds} />
        <div className='right-side'>
          <Power stop={stop} power={power} />
          <Screen power={power} stop={stop} volume={volume} name={soundName || soundsName[soundType]} switchBank={switchBank} />
          <SwitchBank switchBank={switchBank} switchBankBack={switchBankBack} />
          <Volume power={power} volume={volume} handleVolumeChange={handleVolumeChange} />
          <Dummies />
        </div>
      </div>
    </div>
  )
};

export default App;
