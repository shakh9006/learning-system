interface IInputField {
  text: string;
}

interface IVoiceField {
  languageCode: string;
  ssmlGender: string;
}

interface IAudioConfig {
  audioEncoding: string;
}

export interface ConvertToAudio {
  input: IInputField;
  voice: IVoiceField;
  audioConfig: IAudioConfig;
}
