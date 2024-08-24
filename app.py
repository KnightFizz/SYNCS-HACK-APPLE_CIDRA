from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    app.run()


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