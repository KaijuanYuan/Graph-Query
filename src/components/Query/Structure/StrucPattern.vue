<template>
  <div class="strucPattern">
  </div>
</template>

<script>

export default {
  name: 'StrucPattern',
  data:()=>({
       
  }),
  computed:{
    
  },
  methods:{

  },
  created: function(){
    
  }
}
</script>

<style lang="scss"> 
@import '../../../styles/Constants.scss';

.strucPattern{
  flex: 0 0 $PATTERN_FORCED_WIDTH;
  border-style: solid;
  border-width: 1px;
  border-color: $GRAY1;
  height: 100%;
  //width: calc(100% - #{$QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT});
  width: $PATTERN_FORCED_WIDTH;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow: hidden;
  position: relative;
  overflow: hidden;
  
}
</style>
