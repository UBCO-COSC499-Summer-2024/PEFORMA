import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ImportModal from '../../../../app/frontend/src/JS/Department/DataImportImports/DeptImportModal';
import { useAuth } from '../../../../app/frontend/src/JS/common/AuthContext';

jest.mock('../../../../app/frontend/src/JS/common/AuthContext.js');
jest.mock('axios');
jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn()
}));

describe('ImportModal', () => {
  let mockOnDrop;

  beforeEach(() => {
    useAuth.mockReturnValue({ authToken: 'mock-token' });
    mockOnDrop = jest.fn();
    require('react-dropzone').useDropzone.mockReturnValue({
      getRootProps: jest.fn(),
      getInputProps: jest.fn(),
      acceptedFiles: [],
      onDrop: mockOnDrop
    });
  });

  const findFileNameElement = (fileName) => {
    return screen.getByText((content, element) => {
      const hasText = (node) => node.textContent === fileName;
      const nodeHasText = hasText(element);
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    });
  };

  test('renders ImportModal when isOpen is true', () => {
    render(<ImportModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Import Data')).toBeInTheDocument();
  });

  test('does not render ImportModal when isOpen is false', () => {
    render(<ImportModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByText('Import Data')).not.toBeInTheDocument();
  });

  test('allows file selection', async () => {
    render(<ImportModal isOpen={true} onClose={() => {}} />);
    const file = new File(['file contents'], 'test.csv', { type: 'text/csv' });

    act(() => {
      mockOnDrop([file], []);
    });

    await waitFor(() => {
      expect(findFileNameElement('test.csv')).toBeInTheDocument();
    });
  });

  test('removes file when remove button is clicked', async () => {
    render(<ImportModal isOpen={true} onClose={() => {}} />);
    const file = new File(['file contents'], 'test.csv', { type: 'text/csv' });

    act(() => {
      mockOnDrop([file], []);
    });

    await waitFor(() => {
      expect(findFileNameElement('test.csv')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('test.csv')).not.toBeInTheDocument();
    });
  });

  test('uploads files when upload button is clicked', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Upload successful', status: 'success' } });

    render(<ImportModal isOpen={true} onClose={() => {}} />);
    const file = new File(['file contents'], 'test.csv', { type: 'text/csv' });

    act(() => {
      mockOnDrop([file], []);
    });

    await waitFor(() => {
      expect(findFileNameElement('test.csv')).toBeInTheDocument();
    });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Upload successful')).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/upload',
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
          'Content-Type': 'multipart/form-data',
        }),
      })
    );
  });

  test('displays error message on upload failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Upload failed' } } });

    render(<ImportModal isOpen={true} onClose={() => {}} />);
    const file = new File(['file contents'], 'test.csv', { type: 'text/csv' });

    act(() => {
      mockOnDrop([file], []);
    });

    await waitFor(() => {
      expect(findFileNameElement('test.csv')).toBeInTheDocument();
    });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });
  });

  test('closes modal and resets state when close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(<ImportModal isOpen={true} onClose={onCloseMock} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });
});