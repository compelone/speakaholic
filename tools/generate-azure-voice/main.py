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
    filename='/Users/lesterprivott/Downloads/ACCDownload_20230217152745/SSML/%s.mp3' % voice_name)

# The language of the voice that speaks.
speech_config.speech_synthesis_voice_name = voice_name

speech_synthesizer = speechsdk.SpeechSynthesizer(
    speech_config=speech_config, audio_config=audio_config)

# Get text from the console and synthesize to the default speaker.
print("Enter some text that you want to speak >")
text = 'Hi my name is %s, thank you for trying Speakaholic.' % voice

print('Speaking text > %s' % text)
speech_synthesis_result = speech_synthesizer.speak_ssml_async("""<!--ID=B7267351-473F-409D-9765-754A8EBCDE05;Version=1|{"VoiceNameToIdMapItems":[{"Id":"93cdc1ca-0ba2-4615-91ec-495bd6b40b3d","Name":"Microsoft Server Speech Text to Speech Voice (en-US, JasonNeural)","ShortName":"en-US-JasonNeural","Locale":"en-US","VoiceType":"StandardVoice"}]}-->
<!--ID=FCB40C2B-1F9F-4C26-B1A1-CF8E67BE07D1;Version=1|{"Files":{}}-->
<!--ID=5B95B1CC-2C7B-494F-B746-CF22A0E779B7;Version=1|{"Locales":{"en-US":{"AutoApplyCustomLexiconFiles":[{}]}}}-->
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-JasonNeural"><s /><mstts:express-as style="Default"><prosody pitch="-10.00%">Introducing Speakaholic, the revolutionary new app that lets you communicate in a whole new way! With our cutting-edge text-to-speech and image-to-speech AI technology, you can transform any text or image into spoken content, with over 20 custom voices to choose from.</prosody></mstts:express-as><s />
<s /><mstts:express-as style="Default"><prosody pitch="-10.00%">And now, for a limited time only, we're offering an exclusive promotion for new users. Download Speakaholic today and receive 1000 free characters with any character package purchase. That's right – 1000 characters free, and you can start using the app that is changing the way people communicate.</prosody></mstts:express-as><s />
<s /><mstts:express-as style="Default"><prosody pitch="-10.00%">Whether you're a student, professional, or just someone who loves to stay connected, Speakaholic is the perfect tool for anyone who wants to make their voice heard. Our user-friendly interface makes it easy to input text or images and instantly generate spoken content, with a variety of voices to choose from.</prosody></mstts:express-as><s />
<s /><mstts:express-as style="Default"><prosody pitch="-10.00%">Don't miss out on this incredible opportunity to try out Speakaholic at a fraction of the regular price. Download now and experience the power of our AI technology for yourself. With Speakaholic, you can communicate in a whole new way – and save money while you do it!</prosody></mstts:express-as><s /></voice></speak>""").get()

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
