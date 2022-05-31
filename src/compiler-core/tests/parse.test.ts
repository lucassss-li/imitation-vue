import { baseParse } from '../src/parse'
import { NodeTypes } from '../src/ast'
describe('Parse', () => {
    describe('interpolation', () => {
        test('simple interpolation', () => {
            const ast = baseParse('{{message}}')
            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.INTERPOLATION,
                content: {
                    type: NodeTypes.SIMPLE_EXPRESSION,
                    content: 'message',
                },
            })
        })
    })
    describe('element', () => {
        test('simple element div', () => {
            const ast = baseParse('<div></div>')
            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.ELEMENT,
                tag: 'div',
                children: [],
            })
        })
    })
    describe('text', () => {
        test('simple text', () => {
            const ast = baseParse('hello world')
            expect(ast.children[0]).toStrictEqual({
                type: NodeTypes.TEXT,
                content: 'hello world',
            })
        })
    })
    test('complex', () => {
        const ast = baseParse('<p>hi,{{message}}</p>')
        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.ELEMENT,
            tag: 'p',
            children: [
                {
                    type: NodeTypes.TEXT,
                    content: 'hi,',
                },
                {
                    type: NodeTypes.INTERPOLATION,
                    content: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: 'message',
                    },
                },
            ],
        })
    })
    test('nested', () => {
        const ast = baseParse('<div><p>hi</p>{{message}}</div>')
        expect(ast.children[0]).toStrictEqual({
            type: NodeTypes.ELEMENT,
            tag: 'div',
            children: [
                {
                    type: NodeTypes.ELEMENT,
                    tag: 'p',
                    children: [
                        {
                            type: NodeTypes.TEXT,
                            content: 'hi',
                        },
                    ],
                },
                {
                    type: NodeTypes.INTERPOLATION,
                    content: {
                        type: NodeTypes.SIMPLE_EXPRESSION,
                        content: 'message',
                    },
                },
            ],
        })
    })
    test('should throw error when lack end tag', () => {
        expect(() => {
            baseParse('<div><span></div>')
        }).toThrow('lack end tag')
    })
})
