<template>
  <div>
    <h2>Event2组件</h2>
    <!-- 在子级组件内部中手动分发父级组件传递过来的自定义事件 可以传递字符串数据也可以传递对象数据 -->
    <button @click="$emit('click','强哥什么样不记得了')">组件2中的按钮</button>
    <button @click="$emit('xxx',{age:18})">组件2中的第二个按钮</button>
  </div>
</template>
