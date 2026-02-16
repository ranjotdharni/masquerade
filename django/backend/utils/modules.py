from typing import Any

def isGenericError(value: Any) -> bool:
    if isinstance(value, dict) and "error" in value:
       return True

    return False 
