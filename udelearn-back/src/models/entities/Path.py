class Path():
    
    def __init__(self,id,name=None,major=None,email=None,document=None,keywords=None) -> None:
        self.id = id
        self.name = name
        self.major = major
        self.email = email
        self.document = document
        self.keywords = keywords
    
    def to_JSON(self):
        return{
            'id' : self.id,
            'name' : self.name,
            'major' : self.major,
            'email' : self.email,
            'keywords' : self.keywords
        }