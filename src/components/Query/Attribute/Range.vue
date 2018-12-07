<template>
  <div class="range" id="rangeVis">
    <!-- <h1> Range~</h1> -->
    <div class="constraints-wrapper"  
      v-for="(constraint, ind) in constraints" 
      :key ="ind">
      
      <div class="control">
        <div class="control-button" @click="applyConstraints(ind)"> apply </div>
        <div class="control-button" @click="deletConstraints(ind)"> delete </div>
      </div>

      <div class="header" v-for="(attr, no) in constraint.attributes" 
      :key ="no">
        <div class="bar-wrapper">
          <div class="bar-cont">
            <div class="att-range"
              :style="{
                left: prec(attr.leftX),
                width: prec(attr.rightX - attr.leftX)
              }"></div>
          </div>
        </div>
        
        <div class="label">
          <div class="text minimum">
            {{attr.left}}
          </div>
          <div class="text maximum">
            {{attr.right}}
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Range',
  data:()=>({
    constraints: null, 
  }),
  computed:{
    
  },
  methods:{
    prec(index) {
      return `${index}%`
    },
    applyConstraints(ind) {
      this.$store.commit('invalidConstraints')
      this.$store.commit('activeConstraints', ind)
    },
    deletConstraints(ind) {
      this.$store.commit('deleteConstraints', ind)
    },
  },
  created: function(){
    this.constraints = this.$store.state.attribute.constraints
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"> 
@import '../../../styles/Constants.scss';

.range{
  flex: 0 0 calc(98% - #{$QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT});
  border-style: solid;
  border-width: 1px 3px 1px 1px;
  border-color: $GRAY1;
  width: 100%;
  height: calc(98% - #{$QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT});
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  

  .constraints-wrapper{
    flex: 0 0 $CONSTRAINT_FORCED_HEIGHT;
    border-style: solid;
    border-width: 0px 1px 1px 1px;
    border-color: $GRAY1;
    height: $CONSTRAINT_FORCED_HEIGHT;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: row;

    .control {
      flex: 0 0 $FILTER_FORCED_WIDTH;
      position: relative;
      width: $FILTER_FORCED_WIDTH;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: row;
      // border-style: solid;///
      // border-width: 1px 1px 1px 0px;///
      // border-color: $GRAY1;///
      
      .control-button {
        justify-content: center;
        align-items: center;
        display: flex;
        height: 24px;
        font-size: 14px;
        color: #777;
        padding: 0 10px;
        margin: 0 5px;
        background-color: $GRAY0;
        border: 1px solid $GRAY3;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 200ms, color 200ms;
        
        &:hover {
          background-color: $GRAY1;
        }
        
      }
    }

    .header {
      flex: 0 0 $FILTER_FORCED_WIDTH;
      // border-style: solid;
      // border-width: 2px 1px 1px 2px;
      // border-color: $GRAY1;
      width: $FILTER_FORCED_WIDTH;
      position: relative;
      overflow: hidden;

      .bar-wrapper {
        height: 50%;
        margin: 0 10px 10px 10px;
        border-bottom: 3px solid #FF7043;
        position: relative;
        padding: 0px 10px;
        box-sizing: border-box;
        
        .bar-cont {
          width: 100%;
          height: 100%;
          position: relative;

          .att-range {
            height: calc(100% - #{$ATTRIBUTE_CONSTRAINT_WIDTH}/4);
            position: relative;
            border-bottom: $ATTRIBUTE_CONSTRAINT_WIDTH solid #FFB300;
            
            // position: absolute;
            // height: 100%;
            // transform: translateY(1px);
            // bottom: -3px;
            // background-color: #FFB300;
            // border-bottom: 5px solid #FFB300;
            // transition: width 200ms;

          }
        }

      }

      .label {
        display: flex;
        padding: 0 17px;

        .text {
          flex: 1;
          font-size: 12px;
          color: $GRAY5;
          text-shadow: 0 0 1px $GRAY3;
          text-align: left;
          &.maximum {
            text-align: right;
          }
        }
      }

      

    }

  }

}

//滚动条宽高
::-webkit-scrollbar{
  width: 5px;
  height: 5px;
  background-color: #F5F5F5;
}

//轨道
::-webkit-scrollbar-track{
  background: #f6f6f6;
  border-radius:2px;
}

//滑块
::-webkit-scrollbar-thumb{
  background: #aaa;
  border-radius:2px;
}
::-webkit-scrollbar-thumb:hover{
    background: #747474;
  }
::-webkit-scrollbar-corner{
  background: #f6f6f6;
}
</style>
