
GENERAL_ERROR_TYPE = 0

class GenericError():

    def __init__(self, message="", type=GENERAL_ERROR_TYPE, content=None):
        super().__init__(message)
        self.error = True
        self.message = message
        self.type = type
        self.content = content or {}

    def to_dict(self):
        rv = dict()
        rv['error'] = self.error
        rv['message'] = self.message
        rv['type'] = self.type
        rv['content'] = self.content

        return rv
