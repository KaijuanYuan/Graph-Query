<template>
  <div class="attribute">
    <distribution></distribution>
    <range></range>
  </div>
</template>

<script>
import Distribution from './Distribution.vue'
import Range from './Range.vue'


export default {
  name: 'Attribute',
  components:{
    "distribution": Distribution,
    "range": Range,
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">  
@import '../../../styles/Constants.scss';

div.attribute{
    flex: 1 1;
    border-style: solid;
    border-width: 0px 2px 2px 2px;
    border-color: transparent;
    padding: 0%;
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    
}
</style>
