<template>
  <div class="query">
    <attribute></attribute>
    <structure></structure>
  </div>
</template>

<script>
//局部注册组件
import Attribute from './Attribute/Attribute.vue'
import Structure from './Structure/Structure.vue'

export default {
  name: 'Query',
  components:{
    "attribute": Attribute,
    "structure": Structure,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">  
@import '../../styles/Constants.scss';

div.query{
  flex:1 1 30%;
  margin: 5px;
  height: 30%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  
  .structure{
    min-width: $QUERY_ATTRIBUTE_MIN_WIDTH;
  }

  .attribute {
    min-width: $QUERY_ATTRIBUTE_MIN_WIDTH;
  }
}

</style>
