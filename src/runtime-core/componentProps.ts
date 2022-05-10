import { extend } from '../shared/index'

export function initProps(instance, rawProps) {
    instance.props = extend(instance.props, rawProps)
}
