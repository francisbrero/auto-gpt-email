# Running a LLM in your browser or as an API!

This is based on Vicuna a version of LLaMA but which can run on your local.
By using Vicuna, we no longer need to use OpenAI, and the performance is actually surprisingly comparable. Pretty incredible right!
[Vicuna](https://lmsys.org/blog/2023-03-30-vicuna/)

# Getting started
## Getting everything ready
### Python Setup
``` bash
cd LLM_API
python3 -m venv env
source env/bin/activate
```
``` bash
pip3 install -r requirements.txt
```
### Node setup
We'll need node 18+
``` bash
nvm install 18
nvm use 18
```

## install & Fast Chat
Let's get LLaMA installed and configure it based on the Vicuna weights
### install LLaMA
Install [LLaMA](https://github.com/cocktailpeanut/dalai) using node. To be clear, we'll install Alpaca because it's smaller. This will still take a few minutes
For the record, the model requires quite a bit of space
- Full: The model takes up 31.17GB
- Quantized: 4.21GB
``` bash
npx dalai llama install 7B
```

Optionally, if you want to try the model you've installed, you can access it via your browser
``` bash
npx dalai serve
```
and open http://localhost:3000 in your browser. Have fun! 
This will give you a sense for how powerful your computer actually is...

### install the Vicuna weights
Get the weights to apply to our model
``` bash
python3 -m fastchat.model.apply_delta \
    --base-model-path ~/dalai/llama \
    --target-model-path ./output/vicuna-7b \
    --delta-path lmsys/vicuna-7b-delta-v1.1
```

``` bash
python3 -m fastchat.serve.cli --model-path lmsys/fastchat-t5-3b-v1.0 --device cpu
```

## Serve as a web page
To serve using the web UI, you need three main components: web servers that interface with users, model workers that host one or more models, and a controller to coordinate the webserver and model workers. 
By following these steps, you will be able to serve your models using the web UI. You can open your browser and chat with a model now.

### Launch the controller
```
python3 -m fastchat.serve.controller
```
This controller manages the distributed workers.

### Launch the model worker
```
python3 -m fastchat.serve.model_worker --model-path /path/to/model/weights
```
Wait until the process finishes loading the model and you see "Uvicorn running on ...". You can launch multiple model workers to serve multiple models concurrently. The model worker will connect to the controller automatically.

To ensure that your model worker is connected to your controller properly, send a test message using the following command:
```
python3 -m fastchat.serve.test_message --model-name vicuna-7b
```
You will see a short output.

### Launch the Gradio web server
```
python3 -m fastchat.serve.gradio_web_server
```
This is the user interface that users will interact with.

