
### Add a layer

### Install requirements to folder location

`python3 -m pip install -r requirements.txt -t ./python`

`pip freeze > requirements.txt`

Zip the python directory into a file

`zip -r python_layer.zip ./python/`

### Publish function manually

`zip speakaholic-text-to-speech-function.zip main.py __init__.py requirements.txt`

###
