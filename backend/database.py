# No MongoDB - using local JSON files for storage
# Stub objects to prevent import errors

class _FakeCollection:
    """Fake MongoDB collection - silently ignores all operations."""
    async def insert_one(self, doc):
        pass
    async def find(self, *args, **kwargs):
        return []
    async def find_one(self, *args, **kwargs):
        return None
    async def delete_one(self, *args, **kwargs):
        pass

class _FakeClient:
    pass

chat_collection = _FakeCollection()
client = _FakeClient()
