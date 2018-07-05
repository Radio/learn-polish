'use strict';

/* global SpeechSynthesisUtterance */

export default class Synthesis {
  constructor () {
    this.synth = window.speechSynthesis;

    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      this.polishVoice = this.voices.filter(voice => voice.lang === 'pl-PL')[0];
      this.russianVoice = this.voices.filter(voice => voice.lang === 'ru-RU')[0];
    };
    this.synth.onvoiceschanged = loadVoices;
    loadVoices();
  }

  sayInPolish (text) {
    if (!this.polishVoice) {
      return;
    }

    this.synth.speak(this.createUtterance(text, this.polishVoice, 0.9, 0.9));
  }

  sayInRussian (text) {
    if (!this.russianVoice) {
      return;
    }

    this.synth.speak(this.createUtterance(text, this.russianVoice, 0.9, 0.9));
  }

  createUtterance (text, voice, pitch = 1, rate = 1) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;

    return utterance;
  }
}
