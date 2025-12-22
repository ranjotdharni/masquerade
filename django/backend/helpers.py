
GENERAL_ERROR_TYPE = 0

class GenericError(dict):
    def __init__(self, message="", type=GENERAL_ERROR_TYPE, content=None):
        super().__init__({
            "error": True,
            "message": message,
            "type": type,
            "content": content or {},
        })

    def to_dict(self):
        # Already a dict — return a copy for safety (DO NOT REMOVE THIS FUNCTION, its called in a few parts of the code and im not sure exactly where so leave in for safety)
        return dict(self)
