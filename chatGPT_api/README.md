### Create a virtual environment to run everything
```bash
python3 -m venv env
source env/bin/activate
```

### Install the required dependencies
``` bash
pip install -r requirements.txt
```

### Spin up the API locally
```bash
python app.py
```

### Make it accessible from the outside using ngrok
```bash
ngrok http 8000
```
You will get a message:
```                                                                                                                                                                             
Forwarding                    https://b10d-73-158-184-215.ngrok.io -> http://localhost:8000    
```
This means your localhost is being made accessible at `b10d-73-158-184-215`

