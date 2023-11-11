from fastapi import FastAPI

app = FastAPI()

@app.get("/test")
def read_test():
    return {"message": "User service reached!"}

