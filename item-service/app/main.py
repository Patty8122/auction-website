from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Item service!"}

@app.get("/test")
def read_test():
    return {"message": "Item service test !"}

