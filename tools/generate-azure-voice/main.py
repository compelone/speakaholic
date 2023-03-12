import os
import azure.cognitiveservices.speech as speechsdk

# This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
speech_config = speechsdk.SpeechConfig(subscription=os.environ.get(
    'SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))
speech_config.set_speech_synthesis_output_format(
    speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3)

print('What voice do you want to use >')
voice = input()

voice_name = 'en-US-%sNeural' % voice
print('Using voice %s' % voice_name)
audio_config = speechsdk.audio.AudioOutputConfig(
    filename='/Users/lesterprivott/sc/speakaholic/tools/generate-azure-voice/%s.mp3' % voice_name)

# The language of the voice that speaks.
speech_config.speech_synthesis_voice_name = voice_name

speech_synthesizer = speechsdk.SpeechSynthesizer(
    speech_config=speech_config, audio_config=audio_config)

# Get text from the console and synthesize to the default speaker.
# print("Enter some text that you want to speak >")
# text = 'Hi my name is %s, thank you for trying Speakaholic.' % voice

# print('Speaking text > %s' % text)
text = '''<!--ID=B7267351-473F-409D-9765-754A8EBCDE05;Version=1|{"VoiceNameToIdMapItems":[{"Id":"93cdc1ca-0ba2-4615-91ec-495bd6b40b3d","Name":"Microsoft Server Speech Text to Speech Voice (en-US, JasonNeural)","ShortName":"en-US-JasonNeural","Locale":"en-US","VoiceType":"StandardVoice"}]}-->
<!--ID=FCB40C2B-1F9F-4C26-B1A1-CF8E67BE07D1;Version=1|{"Files":{}}-->
<!--ID=5B95B1CC-2C7B-494F-B746-CF22A0E779B7;Version=1|{"Locales":{"en-US":{"AutoApplyCustomLexiconFiles":[{}]}}}-->
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-JasonNeural"><s /><mstts:express-as style="Default"><prosody pitch="-10.00%">Welcome, to Byitll, LLC, we are pleased to bring you our new text to speech application, Speakaholic. With Speakaholic, we make it easy for you to enter text and convert it to speech, now you can make videos using custom voices, like this one. And with over 20 voices available we are sure you will find a voice that works for you and your text to speech projects. Stay tuned for more videos showing what Speakaholic can do!</prosody></mstts:express-as><s /></voice></speak>'''
speech_synthesis_result = speech_synthesizer.speak_ssml_async(text).get()

if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
    print("Speech synthesized for text [{}]".format(text))
elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
    cancellation_details = speech_synthesis_result.cancellation_details
    print("Speech synthesis canceled: {}".format(cancellation_details.reason))
    if cancellation_details.reason == speechsdk.CancellationReason.Error:
        if cancellation_details.error_details:
            print("Error details: {}".format(
                cancellation_details.error_details))
            print("Did you set the speech resource key and region values?")
