class Config(object):
  DEBUG = True
  TESTING = True
  CSRF_ENABLED = False
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  SQLALCHEMY_DATABASE_URI = 'sqlite:////home/cale/Dropbox/code/underdog/src/drafts.db'
  CSV_FILE_PATH = '/home/cale/Dropbox/code/underdog/src/data.csv'
  JWT_SECRET_KEY = 'P6ZDRxr95xyVstu6zQ8f'