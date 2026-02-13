from typing import Any

def isGenericError(value: Any) -> bool:
    if isinstance(value, dict) and value["error"]:
       return True

    return False 
