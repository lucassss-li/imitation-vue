export function initSlots(instance, children) {
    const slots = {}
    for (const key in children) {
        const value = children[key]
        slots[key] = normalizeSlotValue(value)
    }
    instance.slots = slots
}

function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}
