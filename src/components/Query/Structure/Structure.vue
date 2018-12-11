<template>
    <div class="structure">
        <strucPattern></strucPattern>
        <strucInput></strucInput>
    </div>
</template>

<script>
import strucPattern from "./StrucPattern.vue";
import strucInput from "./StrucInput.vue";

export default {
    name: "Structure",
    components: {
        strucPattern: strucPattern,
        strucInput: strucInput
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/Constants.scss";

div.structure {
    flex: 1 1;
    border-style: solid;
    border-width: 0px 2px 2px 2px;
    border-color: transparent;
    width: 50%;
    min-height: $QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}
</style>
