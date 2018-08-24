# -*- coding: utf-8 -*-
import queue


def main():
    q = queue.Queue()
    q.put('a')
    print(q.get())
    print(q.get_nowait())


if __name__ == "__main__":
    main()