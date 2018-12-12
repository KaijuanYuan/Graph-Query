<template>
    <div class="visualization">
        <p>{{count}}</p>
        <GraphTable></GraphTable>
        <div>
            <button @click="increment">+</button>
            <button @click="decrement">-</button>
            <button v-show="true" @click="myfunc">-</button>
        </div>
        <p>{{nameZ}}</p>
    </div>
</template>

<script>
//局部注册组件
import { myFunction } from "../../store/test";
import GraphTable from "./GraphTable/GraphTable";
/*
//import authorsCsvUri from '../../../data/output/authors.csv'
(async function () {
  const resp = await fetch(authorsCsvUri)
  const text = await resp.text()
  //console.log(text)
  return text
}())
*/

export default {
    name: "Visualization",
    components: {
        'GraphTable': GraphTable
    },
    data: () => ({
        test: null,
        nameZ: "LeiseHolz"
    }),
    computed: {
        count() {
            return this.$store.state.attribute.count;
        }
    },
    methods: {
        increment() {
            this.$store.commit("increment");
        },
        decrement() {
            this.$store.commit("decrement");
        },
        myfunc: function() {
            myFunction();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../styles/Constants.scss";

div.visualization {
    flex: 1 1 70%;
    margin: 0px 5px 5px 5px;
    padding: 0px;
    height: 70%;
    border-style: solid;
    border-width: 2px;
    border-color: 000000;
    display: flex;
    flex-direction: column;
}
</style>
