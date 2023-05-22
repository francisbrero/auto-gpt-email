from flask import Flask, request, jsonify
from dotenv import find_dotenv, load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from dotenv import find_dotenv, load_dotenv
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)


# Initialize the Flask app
# Flask is a web application framework written in Python
flask_app = Flask(__name__)
flask_app.debug = True
flask_app.use_reloader = True


# get our pinecone_api_key from the environment variable
# Load environment variables from .env file
load_dotenv(find_dotenv())

# Create a function that 
def draft_email(user_input, name="Francis"):
    chat = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=1)

    template = """
    
    You are a helpful assistant that drafts an email reply based on an a new email.
    
    Your goal is to help the user quickly create a perfect email reply.
    
    Keep your reply short and to the point and mimic the style of the email so you reply in a similar manner to match the tone.
    
    Make sure to sign of with {signature}.
    
    """

    signature = f"Cheers, \n\{name}"
    system_message_prompt = SystemMessagePromptTemplate.from_template(template)

    human_template = "Here's the email to reply to and consider any other comments from the user for reply as well: {user_input}"
    human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

    chat_prompt = ChatPromptTemplate.from_messages(
        [system_message_prompt, human_message_prompt]
    )

    chain = LLMChain(llm=chat, prompt=chat_prompt)
    response = chain.run(user_input=user_input, signature=signature, name=name)

    return response



@flask_app.route("/webhook", methods=["GET", "POST"])
def webhook():
    if request.method == 'POST':
        print("Data received from Webhook is: ", request.json)
        message = request.json["message"].strip()
        action = request.json["action"].strip()
        user_input = request.json["user_input"].strip()
        text = "\"" + message + "\"" + "\n" + user_input
        if action == "reply":
            response = draft_email(text)
            print(response)
            return jsonify({"draft": response})


# Run the Flask app
if __name__ == "__main__":
    flask_app.run(port=8000)
