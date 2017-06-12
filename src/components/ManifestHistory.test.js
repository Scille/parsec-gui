import React from 'react'
import { shallow } from 'enzyme'
import ManifestHistory from './ManifestHistory'

describe('ManifestHistory Component', () => {
  const setup = (loading, listView=true) => {
    const props = {
      state: {
        history: [
          {
            version: 1,
            entries: { added: {}, changed: {}, removed: {} },
            groups: { added: {}, changed: {}, removed: {} },
            dustbin: { added: [], removed: [] },
            versions: { added: {}, changed: {}, removed: {} }

          },
          {
            version: 2,
            entries: { added: { '/file.txt': { id: 'file_id' } }, changed: {}, removed: {} },
            groups: { added: {}, changed: {}, removed: {} },
            dustbin: { added: [], removed: [] },
            versions: { added: { 'file_id': 1 } , changed: {}, removed: {} }
          },
          {
            version: 3,
            entries: { added: {}, changed: { '/file.txt': { id: 'file_id' } }, removed: {} },
            groups: { added: {}, changed: {}, removed: {} },
            dustbin: { added: [], removed: [] },
            versions: { added: {} , changed: { 'file_id': 1 }, removed: {} }
          },
          {
            version: 4,
            entries: { added: {}, changed: {}, removed: { '/file.txt': { id: 'file_id' } } },
            groups: { added: {}, changed: {}, removed: {} },
            dustbin: { added: [{ path: '/file.txt' }], removed: [] },
            versions: { added: {} , changed: {}, removed: { 'file_id': 1 } }
          },
          {
            version: 5,
            entries: { added: { '/file.txt': { id: 'file_id' } }, changed: {}, removed: {} },
            groups: { added: {}, changed: {}, removed: {} },
            dustbin: { added: [], removed: [{ path: '/file.txt' }] },
            versions: { added: { 'file_id': 1 } , changed: {}, removed: {} }
          },
        ],
        socket: { connected: true, loading }
      },
      dispatch: {
        init: jest.fn(),
        refresh: jest.fn(),
        restoreVersion: jest.fn(),
        showModal: jest.fn(),
        hideModal: jest.fn()
      }
    }
    const enzymeWrapper = shallow(<ManifestHistory {...props} />)
    return { props, enzymeWrapper }
  }

  describe('should render self and subcomponents', () => {
    it('During loading', () => {
      const { enzymeWrapper } = setup(true)

      const header = enzymeWrapper.find('.header')
      expect(header.find('.title').text()).toBe('History')
      expect(header.find('.dropdown-content').text()).toBe('Actions Refresh')

      const HistoryView = enzymeWrapper.find('.history-view')
      expect(HistoryView.find('#loader-wrapper').exists()).toBe(true)

      const modalsContainer = enzymeWrapper.find('ModalsContainer')
      expect(modalsContainer.exists()).toBe(false)
    })

    it('After loading, on listView', () => {
      const { enzymeWrapper } = setup(false)

      const header = enzymeWrapper.find('.header')
      expect(header.find('.title').text()).toBe('History')
      expect(header.find('.dropdown-content').text()).toBe('Actions Refresh')

      const HistoryView = enzymeWrapper.find('.history-view')
      expect(HistoryView.find('.history-versions').length).toBe(5)

      const v5 = HistoryView.find('.history-versions').at(0)
      expect(v5.find('.version').text()).toBe('V.5')
      expect(v5.find('.personal-files').find('.fa-folder-o').text()).toBe(' Personal Files')
      expect(v5.find('.personal-files').find('.fa-added').text()).toBe(' /file.txt')
      expect(v5.find('.personal-files').find('.fa-changed').exists()).toBe(false)
      expect(v5.find('.personal-files').find('.fa-removed').exists()).toBe(false)
      expect(v5.find('.deleted-files').find('.fa-folder-o').text()).toBe(' Deleted Files')
      expect(v5.find('.deleted-files').find('.fa-added').exists()).toBe(false)
      expect(v5.find('.deleted-files').find('.fa-removed').text()).toBe(' /file.txt')
      expect(v5.find('.options').text()).toBe('Current')

      const v4 = HistoryView.find('.history-versions').at(1)
      expect(v4.find('.version').text()).toBe('V.4')
      expect(v4.find('.personal-files').find('.fa-folder-o').text()).toBe(' Personal Files')
      expect(v4.find('.personal-files').find('.fa-added').exists()).toBe(false)
      expect(v4.find('.personal-files').find('.fa-changed').exists()).toBe(false)
      expect(v4.find('.personal-files').find('.fa-removed').text()).toBe(' /file.txt')
      expect(v4.find('.deleted-files').find('.fa-folder-o').text()).toBe(' Deleted Files')
      expect(v4.find('.deleted-files').find('.fa-added').text()).toBe(' /file.txt')
      expect(v4.find('.deleted-files').find('.fa-removed').exists()).toBe(false)
      expect(v4.find('.options').text()).toBe('Restore')

      const v3 = HistoryView.find('.history-versions').at(2)
      expect(v3.find('.version').text()).toBe('V.3')
      expect(v3.find('.personal-files').find('.fa-folder-o').text()).toBe(' Personal Files')
      expect(v3.find('.personal-files').find('.fa-added').exists()).toBe(false)
      expect(v3.find('.personal-files').find('.fa-changed').text()).toBe(' /file.txt')
      expect(v3.find('.personal-files').find('.fa-removed').exists()).toBe(false)
      expect(v3.find('.deleted-files').exists()).toBe(false)
      expect(v3.find('.options').text()).toBe('Restore')

      const v2 = HistoryView.find('.history-versions').at(3)
      expect(v2.find('.version').text()).toBe('V.2')
      expect(v2.find('.personal-files').find('.fa-folder-o').text()).toBe(' Personal Files')
      expect(v2.find('.personal-files').find('.fa-added').text()).toBe(' /file.txt')
      expect(v2.find('.personal-files').find('.fa-changed').exists()).toBe(false)
      expect(v2.find('.personal-files').find('.fa-removed').exists()).toBe(false)
      expect(v2.find('.deleted-files').exists()).toBe(false)
      expect(v2.find('.options').text()).toBe('Restore')

      const v1 = HistoryView.find('.history-versions').at(4)
      expect(v1.find('.version').text()).toBe('V.1')
      expect(v1.find('.personal-files').exists()).toBe(false)
      expect(v1.find('.deleted-files').exists()).toBe(false)
      expect(v1.find('.options').text()).toBe('Restore')

      const modalsContainer = enzymeWrapper.find('ModalsContainer')
      expect(modalsContainer.exists()).toBe(false)
    })
  })

  describe('should dispatch actions', () => {
    it('refresh button should call refresh() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.fa-refresh').parent().simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.refresh.mock.calls.length).toBe(1)
    })
    it('restore button should call showModal() when clicked', () => {
      const { enzymeWrapper, props } = setup(false)

      enzymeWrapper.find('.history-versions').at(3).find('.main-button').simulate('click', { preventDefault: () => {} })
      expect(props.dispatch.showModal.mock.calls.length).toBe(1)
    })
  })
})
