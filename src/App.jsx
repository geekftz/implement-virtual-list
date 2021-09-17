import React, { useState, useEffect, useRef, useMemo } from 'react';
import './App.css';

import axios from 'axios';

function App() {
  // 所有数据
  const [data, setData] = useState([]);

  const [isRequest, setIsRequest] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('正在加载中...');

  const containerRef = useRef();

  // 单个子元素的高度
  const itemHeight = useMemo(() => {
    return 100;
  }, []);

  // 容器高度
  const [containerSize, setContainSize] = useState(0);

  // 记录当前滚动的第一个元素的下标
  const [startIndex, setStartIndex] = useState(0);

  // 计算出当前滚动的最后一个元素的下标
  const maxIndex = useMemo(() => {
    return data.length - 1;
  }, [data]);

  // 计算出当前滚动的最后一个元素的下标
  const endIndex = useMemo(() => {
    if (startIndex + containerSize > maxIndex) {
      return maxIndex;
    }

    return startIndex + containerSize;
  }, [maxIndex, startIndex, containerSize]);

  // 只填充满屏幕的数据
  const showData = useMemo(() => {
    console.log('showData changed');
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const blankFillStyle = useMemo(() => {
    // 上方空白占位
    const topBlankHeight = startIndex * itemHeight;
    // 下方空白占位
    const bottomBlankHeight = (maxIndex - endIndex) * itemHeight;

    return {
      paddingTop: topBlankHeight,
      paddingBottom: bottomBlankHeight,
    };
  }, [startIndex, maxIndex, endIndex]);

  // 获取mock列表数据
  const getData = (num) => {
    setIsRequest(true);
    axios.get(`http://localhost:4000/data?num=${num}`).then((res) => {
      const {
        data: { list },
      } = res;
      console.log('%c getData list ⧭', 'color: #00e600', list);

      const newData = [...data, ...list];

      setData(newData);
      setIsRequest(false);
    });
  };

  // 获取容器最多容纳条数
  const getContainSize = () => {
    const newContainSize = ~~(containerRef.current.offsetHeight / itemHeight) + 2;

    setContainSize(newContainSize);
  };

  // 监听滚动
  const handleScroll = (e) => {
    const scrollTop = containerRef?.current?.scrollTop;

    const newStartIndex = ~~(scrollTop / itemHeight);

    console.log(11111);

    // 如果startIndex没有改变 则不操作
    if (startIndex === newStartIndex) {
      console.log(22222);
      return;
    }

    // 更新滚动第一个元素的下标
    setStartIndex(newStartIndex);

    if (startIndex + containerSize > data.length - 1 && !isRequest) {
      console.log('滚动到底部, 追加请求数据');
      getData(20);
    }
  };

  // const updateShowData = () => {
  //   const scrollTop = containerRef.current.scrollTop;

  //   const newStartIndex = ~~(scrollTop / itemHeight);

  //   // 如果startIndex没有改变 则不操作
  //   if (startIndex === newStartIndex) {
  //     return;
  //   }

  //   // 更新滚动第一个元素的下标
  //   setStartIndex(newStartIndex);

  //   if (startIndex + containerSize > data.length - 1 && !isRequest) {
  //     console.log('滚动到底部, 追加请求数据');
  //     getData(20);
  //   }
  // }

  // 第一次挂载页面
  useEffect(() => {
    getData(20);

    getContainSize();
    window.onresize = getContainSize;
    window.orientationChange = getContainSize;
  }, []);

  return (
    // 最外层容易 获取 滚动高度
    <div className="App" ref={containerRef} onScroll={handleScroll}>
      {/* 包含上下空白的容器 */}
      <div style={blankFillStyle}>
        <ul className="list">
          {/* {data.map((item) => { */}
          {showData.map((item) => {
            return (
              <li className="item" key={item.id}>
                {item.title}
              </li>
            );
          })}
        </ul>
        {isRequest ? <div>{loadingMsg}</div> : null}
      </div>
    </div>
  );
}

export default App;
