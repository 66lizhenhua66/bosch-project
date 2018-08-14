# introduction
该程序连接PLC，完成对PLC的控制与读取

# requirement

1. snap7

# install

    pip install -r requirements.txt

# start

    python checker.py

可能遇到的error: snap7的错误：snap7.snap7exceptions.Snap7Exception: can't find snap7 library. If installed, try running ldconfig，
将当前目录下的 Win64文件夹下的 snap7.dll & snap7.lib 拷贝到环境变量所在的地方，如： C:\windows\system32 即可解决




