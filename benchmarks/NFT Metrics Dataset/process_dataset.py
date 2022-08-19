from pathlib import Path
import uuid

path = "./Outside Collection"
pathlist = Path(path).glob('**/*')
for index, path in enumerate(pathlist):
    path.rename(str(path.parent) + "/" + str(index+1) + ".jpg")
